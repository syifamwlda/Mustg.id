<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourGuide extends Model {
    protected $fillable = ['name','photo_url','languages','rating','total_tours','price_per_day','specialization','badge','phone','license_number','is_available'];
    protected $casts    = ['is_available'=>'boolean','rating'=>'float','price_per_day'=>'integer','total_tours'=>'integer'];

    public function orders(): HasMany { return $this->hasMany(Order::class); }
}
