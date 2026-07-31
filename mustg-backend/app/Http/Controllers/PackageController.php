<?php
namespace App\Http\Controllers;
use App\Models\Package;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller {
    public function index(): JsonResponse {
        $packages = Package::where('is_active', true)
            ->with('destinations:id,name,city,thumbnail_url')
            ->orderBy('price')
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), [
                    'includes_array' => $p->includes_array,
                    'discount_pct'   => $p->original_price > 0
                        ? round((1 - $p->price / $p->original_price) * 100) : 0,
                ]);
            });
        return response()->json(['success'=>true,'data'=>$packages]);
    }
    public function show(int $id): JsonResponse {
        $p = Package::with('destinations')->findOrFail($id);
        return response()->json(['success'=>true,'data'=>$p]);
    }
}
