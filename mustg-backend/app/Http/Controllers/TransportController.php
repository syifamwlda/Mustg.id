<?php
namespace App\Http\Controllers;
use App\Models\Transport;
use Illuminate\Http\JsonResponse;

class TransportController extends Controller {
    public function index(): JsonResponse {
        $transports = Transport::where('is_available', true)->orderBy('price_per_day')->get();
        return response()->json(['success'=>true,'data'=>$transports]);
    }
    public function show(int $id): JsonResponse {
        $t = Transport::findOrFail($id);
        return response()->json(['success'=>true,'data'=>$t]);
    }
}
