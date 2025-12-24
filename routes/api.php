<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);
Route::apiResource('reviews', \App\Http\Controllers\Api\ReviewController::class);
Route::apiResource('books', \App\Http\Controllers\Api\BookController::class);

Route::post('/checkout', [\App\Http\Controllers\Api\OrderController::class, 'checkout']);
Route::get('/purchased-books', [\App\Http\Controllers\Api\OrderController::class, 'purchasedBooks']);
Route::apiResource('orders', \App\Http\Controllers\Api\OrderController::class);
Route::apiResource('cart', \App\Http\Controllers\Api\CartController::class);
Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);

Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
