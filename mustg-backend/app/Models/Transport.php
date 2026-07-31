<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transport extends Model {
    protected $fillable = ['name','icon','type','capacity','price_per_day','description','plate_number','is_available'];
    protected $casts    = ['is_available'=>'boolean','capacity'=>'integer','price_per_day'=>'integer'];

    public function orders(): HasMany { return $this->hasMany(Order::class); }
}
