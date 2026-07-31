<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'city', 'open_hours', 'category', 'description',
        'thumbnail_url', 'rating', 'start_price', 'hotels', 'transfers', 'activities',
    ];

    protected $casts = [
        'rating'      => 'float',
        'start_price' => 'integer',
        'hotels'      => 'integer',
        'transfers'   => 'integer',
        'activities'  => 'integer',
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(TicketType::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopePopular($query)
    {
        return $query->orderByDesc('rating');
    }
}
