<?php
namespace App\Http\Controllers;
use App\Models\TourGuide;
use Illuminate\Http\JsonResponse;

class TourGuideController extends Controller {
    public function index(): JsonResponse {
        $guides = TourGuide::where('is_available', true)->orderByDesc('rating')->get();
        return response()->json(['success'=>true,'data'=>$guides]);
    }
    public function show(int $id): JsonResponse {
        $g = TourGuide::findOrFail($id);
        return response()->json(['success'=>true,'data'=>$g]);
    }
}
