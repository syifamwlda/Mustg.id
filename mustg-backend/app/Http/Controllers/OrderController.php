<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\TicketType;
use App\Models\Transport;
use App\Models\TourGuide;
use App\Models\TransactionLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller {

    /** POST /api/orders — buat pesanan baru */
    public function store(StoreOrderRequest $request): JsonResponse {
        $ticket = TicketType::findOrFail($request->ticket_type_id);

        if ($ticket->destination_id !== (int) $request->destination_id) {
            return response()->json(['success'=>false,'message'=>'Tiket tidak sesuai destinasi.'], 422);
        }

        $ticketSubtotal    = $ticket->price * $request->qty;
        $transportSubtotal = 0;
        $guideSubtotal     = 0;

        // Hitung subtotal transport (opsional)
        if ($request->transport_id) {
            $transport = Transport::findOrFail($request->transport_id);
            if (!$transport->is_available) {
                return response()->json(['success'=>false,'message'=>'Transport tidak tersedia.'], 422);
            }
            $transportSubtotal = $transport->price_per_day;
        }

        // Hitung subtotal tour guide (opsional)
        if ($request->tour_guide_id) {
            $guide = TourGuide::findOrFail($request->tour_guide_id);
            if (!$guide->is_available) {
                return response()->json(['success'=>false,'message'=>'Tour guide tidak tersedia.'], 422);
            }
            $guideSubtotal = $guide->price_per_day;
        }

        $total = $ticketSubtotal + $transportSubtotal + $guideSubtotal;

        $order = Order::create([
            'destination_id'     => $request->destination_id,
            'ticket_type_id'     => $request->ticket_type_id,
            'transport_id'       => $request->transport_id,
            'tour_guide_id'      => $request->tour_guide_id,
            'package_id'         => $request->package_id,
            'visit_date'         => $request->visit_date,
            'qty'                => $request->qty,
            'customer_name'      => $request->customer_name,
            'customer_phone'     => $request->customer_phone,
            'customer_email'     => $request->customer_email,
            'payment_method'     => $request->payment_method,
            'ticket_subtotal'    => $ticketSubtotal,
            'transport_subtotal' => $transportSubtotal,
            'guide_subtotal'     => $guideSubtotal,
            'total'              => $total,
            'notes'              => $request->notes,
            'payment_status'     => 'PENDING',
            'order_status'       => 'WAITING_PAYMENT',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat.',
            'data'    => new OrderResource($order->load(['destination','ticketType','transport','tourGuide','package'])),
        ], 201);
    }

    /** GET /api/orders/{orderCode} */
    public function show(string $orderCode): JsonResponse {
        $order = Order::where('order_code', $orderCode)
            ->with(['destination','ticketType','transport','tourGuide','package','logs'])
            ->firstOrFail();
        return response()->json(['success'=>true,'data'=>new OrderResource($order)]);
    }

    /** PATCH /api/orders/{orderCode}/confirm-payment */
    public function confirmPayment(Request $request, string $orderCode): JsonResponse {
        $order = Order::where('order_code', $orderCode)
            ->with(['destination','ticketType','transport','tourGuide','package'])
            ->firstOrFail();

        if ($order->payment_status === 'CONFIRMED') {
            return response()->json(['success'=>false,'message'=>'Pembayaran sudah dikonfirmasi.'], 409);
        }
        if ($order->order_status !== 'WAITING_PAYMENT') {
            return response()->json(['success'=>false,'message'=>'Status order tidak memungkinkan konfirmasi.'], 422);
        }

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $request->validate(['proof'=>'file|mimes:jpg,jpeg,png,pdf|max:5120']);
            $proofPath = $request->file('proof')->store('payment_proofs','public');
        }

        $order->update([
            'payment_status' => 'CONFIRMED',
            'order_status'   => 'PAID',
            'confirmed_at'   => now(),
            'proof_path'     => $proofPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran dikonfirmasi. Tiket aktif!',
            'data'    => new OrderResource($order->refresh()->load(['destination','ticketType','transport','tourGuide','package','logs'])),
        ]);
    }

    /** PATCH /api/orders/{orderCode}/reschedule */
    public function reschedule(Request $request, string $orderCode): JsonResponse {
        $request->validate(['visit_date'=>['required','date','after:today']]);

        $order = Order::where('order_code', $orderCode)->firstOrFail();

        if (!$order->isReschedulable()) {
            return response()->json(['success'=>false,'message'=>'Pesanan tidak dapat dijadwalkan ulang.'], 422);
        }

        $order->update(['visit_date'=>$request->visit_date, 'order_status'=>'RESCHEDULED']);

        return response()->json(['success'=>true,'message'=>'Tanggal berhasil diubah.','data'=>new OrderResource($order->refresh())]);
    }

    /** PATCH /api/orders/{orderCode}/cancel */
    public function cancel(Request $request, string $orderCode): JsonResponse {
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        if (!in_array($order->order_status, ['WAITING_PAYMENT'])) {
            return response()->json(['success'=>false,'message'=>'Pesanan yang sudah dibayar tidak dapat dibatalkan langsung.'], 422);
        }

        $order->update(['order_status'=>'CANCELLED','payment_status'=>'EXPIRED']);

        return response()->json(['success'=>true,'message'=>'Pesanan dibatalkan.']);
    }

    /** GET /api/orders?email=xxx — riwayat transaksi by email */
    public function findByEmail(Request $request): JsonResponse {
        $request->validate(['email'=>'required|email']);

        $orders = Order::where('customer_email', $request->email)
            ->with(['destination','ticketType','transport','tourGuide','package','logs'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => OrderResource::collection($orders),
            'total'   => $orders->count(),
        ]);
    }

    /** GET /api/orders/{orderCode}/logs — riwayat aktivitas pesanan */
    public function logs(string $orderCode): JsonResponse {
        $order = Order::where('order_code', $orderCode)->with('logs')->firstOrFail();
        return response()->json(['success'=>true,'data'=>$order->logs]);
    }
}
