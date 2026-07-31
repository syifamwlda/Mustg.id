<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id'                 => $this->id,
            'order_code'         => $this->order_code,
            'visit_date'         => $this->visit_date?->format('Y-m-d'),
            'qty'                => $this->qty,

            // Pemesan
            'customer_name'      => $this->customer_name,
            'customer_phone'     => $this->customer_phone,
            'customer_email'     => $this->customer_email,

            // Destinasi & tiket
            'destination'        => $this->whenLoaded('destination', fn() => [
                'id'            => $this->destination->id,
                'name'          => $this->destination->name,
                'city'          => $this->destination->city,
                'thumbnail_url' => $this->destination->thumbnail_url,
            ]),
            'ticket_type'        => $this->whenLoaded('ticketType', fn() => [
                'id'    => $this->ticketType->id,
                'name'  => $this->ticketType->name,
                'price' => $this->ticketType->price,
            ]),

            // Addon
            'transport'          => $this->whenLoaded('transport', fn() => $this->transport ? [
                'id'           => $this->transport->id,
                'name'         => $this->transport->name,
                'icon'         => $this->transport->icon,
                'price_per_day'=> $this->transport->price_per_day,
            ] : null),
            'tour_guide'         => $this->whenLoaded('tourGuide', fn() => $this->tourGuide ? [
                'id'           => $this->tourGuide->id,
                'name'         => $this->tourGuide->name,
                'photo_url'    => $this->tourGuide->photo_url,
                'price_per_day'=> $this->tourGuide->price_per_day,
            ] : null),
            'package'            => $this->whenLoaded('package', fn() => $this->package ? [
                'id'   => $this->package->id,
                'name' => $this->package->name,
            ] : null),

            // Harga rincian
            'ticket_subtotal'    => $this->ticket_subtotal,
            'transport_subtotal' => $this->transport_subtotal,
            'guide_subtotal'     => $this->guide_subtotal,
            'total'              => $this->total,

            // Status
            'payment_method'     => $this->payment_method,
            'payment_status'     => $this->payment_status,
            'order_status'       => $this->order_status,
            'proof_path'         => $this->proof_path,
            'notes'              => $this->notes,
            'confirmed_at'       => $this->confirmed_at?->toISOString(),
            'created_at'         => $this->created_at?->toISOString(),

            // Riwayat log
            'logs'               => $this->whenLoaded('logs', fn() =>
                $this->logs->map(fn($l) => [
                    'event'       => $l->event,
                    'description' => $l->description,
                    'actor'       => $l->actor,
                    'time'        => $l->created_at?->toISOString(),
                ])
            ),
        ];
    }
}
