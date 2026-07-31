<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model {
    protected $fillable = ['name','category','price','original_price','thumbnail_url','includes','duration','min_pax','max_pax','badge','is_active'];
    protected $casts    = ['is_active'=>'boolean','price'=>'integer','original_price'=>'integer'];

    public function getIncludesArrayAttribute(): array {
        return array_filter(array_map('trim', explode("\n", $this->includes)));
    }

    public function destinations(): BelongsToMany {
        return $this->belongsToMany(Destination::class, 'package_destinations');
    }
    public function orders(): HasMany { return $this->hasMany(Order::class); }
}
