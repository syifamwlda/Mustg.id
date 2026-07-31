<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\TourGuideController;
use App\Http\Controllers\PackageController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

Route::prefix('destinations')->group(function () {
    Route::get('/',             [DestinationController::class, 'index']);
    Route::get('/{id}',         [DestinationController::class, 'show']);
    Route::get('/{id}/tickets', [DestinationController::class, 'tickets']);
});

Route::prefix('transports')->group(function () {
    Route::get('/',      [TransportController::class, 'index']);
    Route::get('/{id}',  [TransportController::class, 'show']);
});

Route::prefix('tour-guides')->group(function () {
    Route::get('/',      [TourGuideController::class, 'index']);
    Route::get('/{id}',  [TourGuideController::class, 'show']);
});

Route::prefix('packages')->group(function () {
    Route::get('/',      [PackageController::class, 'index']);
    Route::get('/{id}',  [PackageController::class, 'show']);
});

Route::prefix('orders')->group(function () {
    Route::get('/',                                 [OrderController::class, 'findByEmail']);
    Route::post('/',                                [OrderController::class, 'store']);
    Route::get('/{orderCode}',                      [OrderController::class, 'show']);
    Route::get('/{orderCode}/logs',                 [OrderController::class, 'logs']);
    Route::patch('/{orderCode}/confirm-payment',    [OrderController::class, 'confirmPayment']);
    Route::patch('/{orderCode}/reschedule',         [OrderController::class, 'reschedule']);
    Route::patch('/{orderCode}/cancel',             [OrderController::class, 'cancel']);
});