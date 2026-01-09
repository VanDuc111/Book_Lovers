<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'php_version' => phpversion()]);
});

Route::get('/', function () {
    return view('home');
})->name('home');

// Route bí mật để chạy migrate dành cho gói Render Free
Route::get('/setup-database', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return "Chúc mừng! Database đã được thiết lập xong. <br> Kết quả: " . \Illuminate\Support\Facades\Artisan::output();
    } catch (\Exception $e) {
        return "Lỗi khi chạy migrate: " . $e->getMessage();
    }
});

// Kiểm tra kết nối DB
Route::get('/check-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return "Kết nối Aiven Database: THÀNH CÔNG!";
    } catch (\Exception $e) {
        return "Kết nối Aiven Database: THẤT BẠI. Lỗi: " . $e->getMessage();
    }
});

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

Route::get('/checkout', function () {
    return view('checkout');
});

// Legacy API Routes
Route::any('/api/api.php', [App\Http\Controllers\LegacyApiController::class, 'handle']);
Route::post('/api/login.php', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/api/register.php', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/api/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
