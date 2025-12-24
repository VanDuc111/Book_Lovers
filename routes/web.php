<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/book-list', function () {
    return view('book-list');
})->name('book-list');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/register', function () {
    return view('register');
})->name('register');

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/profile', function () {
    return view('profile');
});

Route::get('/purchased-books', function () {
    return view('purchased-books');
});

Route::get('/reviews', function () {
    return view('reviews');
});

Route::get('/book-details', function () {
    return view('book-details');
});

Route::get('/search-results', function () {
    return view('search-results');
});

Route::get('/admin', function () {
    return view('admin');
});

// Legacy API Routes
Route::any('/api/api.php', [App\Http\Controllers\LegacyApiController::class, 'handle']);
Route::post('/api/login.php', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/api/register.php', [App\Http\Controllers\Api\AuthController::class, 'register']);
