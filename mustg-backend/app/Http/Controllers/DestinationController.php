<?php

namespace App\Http\Controllers;

use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * GET /api/destinations
     * List semua destinasi beserta tiket.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Destination::with('tickets')
            ->orderByDesc('rating');

        // Optional: filter by city
        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        // Optional: search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $destinations = $query->get();

        return response()->json([
            'success' => true,
            'data'    => DestinationResource::collection($destinations),
        ]);
    }

    /**
     * GET /api/destinations/{id}
     * Detail satu destinasi.
     */
    public function show(string $id): JsonResponse
    {
        $destination = Destination::with('tickets')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new DestinationResource($destination),
        ]);
    }

    /**
     * GET /api/destinations/{id}/tickets
     * Tiket tersedia untuk destinasi tertentu.
     */
    public function tickets(string $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $destination->tickets->map(fn ($t) => [
                'id'          => $t->id,
                'name'        => $t->name,
                'price'       => (int) $t->price,
                'description' => $t->description,
            ]),
        ]);
    }
}
