<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionLog extends Model {
    protected $fillable = ['order_id','event','description','actor'];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
