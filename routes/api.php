<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MessageController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/users', [AdminController::class, 'allUsers']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/messages/logs', [AdminController::class, 'messageLogs']);
});

// Chat message routes
Route::middleware("auth:sanctum")->group(function () {
    Route::get("/messages/{receiverId}", [MessageController::class, "index"]);
    Route::post("/messages/{receiverId}", [MessageController::class, "store"]);
});
