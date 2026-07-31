<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'city'          => $this->city,
            'openHours'     => $this->open_hours,
            'category'      => $this->category,
            'description'   => $this->description,
            'thumbnail_url' => $this->thumbnail_url,
            'rating'        => (float) $this->rating,
            'startPrice'    => (int) $this->start_price,
            'hotels'        => $this->hotels,
            'transfers'     => $this->transfers,
            'activities'    => $this->activities,
            'tickets'       => $this->whenLoaded('tickets', fn () =>
                $this->tickets->map(fn ($t) => [
                    'id'    => $t->id,
                    'name'  => $t->name,
                    'price' => (int) $t->price,
                ])->values()
            ),
        ];
    }
}
