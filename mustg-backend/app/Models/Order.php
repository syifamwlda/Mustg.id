<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model {
    use HasFactory;

    protected $fillable = [
        'order_code','destination_id','ticket_type_id',
        'transport_id','tour_guide_id','package_id',
        'visit_date','qty',
        'customer_name','customer_phone','customer_email',
        'payment_method','ticket_subtotal','transport_subtotal','guide_subtotal','total',
        'payment_status','order_status','proof_path','notes','confirmed_at',
    ];

    protected $casts = [
        'visit_date'         => 'date',
        'qty'                => 'integer',
        'total'              => 'integer',
        'ticket_subtotal'    => 'integer',
        'transport_subtotal' => 'integer',
        'guide_subtotal'     => 'integer',
        'confirmed_at'       => 'datetime',
    ];

    protected static function boot() {
        parent::boot();
        static::creating(function (Order $order) {
            if (empty($order->order_code)) {
                $order->order_code = 'MGT-' . strtoupper(Str::random(8));
            }
        });
        // Auto-log setiap perubahan status
        static::created(function (Order $order) {
            TransactionLog::create([
                'order_id'    => $order->id,
                'event'       => 'ORDER_CREATED',
                'description' => "Pesanan dibuat oleh {$order->customer_name}",
                'actor'       => $order->customer_email,
            ]);
        });
        static::updated(function (Order $order) {
            if ($order->wasChanged('payment_status') && $order->payment_status === 'CONFIRMED') {
                TransactionLog::create([
                    'order_id'    => $order->id,
                    'event'       => 'PAYMENT_CONFIRMED',
                    'description' => 'Pembayaran dikonfirmasi',
                    'actor'       => $order->customer_email,
                ]);
            }
            if ($order->wasChanged('visit_date')) {
                TransactionLog::create([
                    'order_id'    => $order->id,
                    'event'       => 'RESCHEDULED',
                    'description' => 'Tanggal kunjungan diubah ke ' . $order->visit_date->format('d M Y'),
                    'actor'       => $order->customer_email,
                ]);
            }
            if ($order->wasChanged('order_status') && $order->order_status === 'CANCELLED') {
                TransactionLog::create([
                    'order_id'    => $order->id,
                    'event'       => 'CANCELLED',
                    'description' => 'Pesanan dibatalkan',
                    'actor'       => $order->customer_email,
                ]);
            }
        });
    }

    public function destination(): BelongsTo  { return $this->belongsTo(Destination::class); }
    public function ticketType(): BelongsTo   { return $this->belongsTo(TicketType::class); }
    public function transport(): BelongsTo    { return $this->belongsTo(Transport::class); }
    public function tourGuide(): BelongsTo    { return $this->belongsTo(TourGuide::class); }
    public function package(): BelongsTo      { return $this->belongsTo(Package::class); }
    public function logs(): HasMany           { return $this->hasMany(TransactionLog::class)->latest(); }

    public function isPaid(): bool            { return $this->payment_status === 'CONFIRMED'; }
    public function isReschedulable(): bool   { return in_array($this->order_status, ['WAITING_PAYMENT','PAID']); }
}
