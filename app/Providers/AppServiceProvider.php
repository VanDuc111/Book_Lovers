<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // 1. Ép HTTPS nếu chạy trên Production hoặc qua Proxy (Render)
        if (config('app.env') === 'production' || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // 2. Ép URL gốc nếu APP_URL được cấu hình là HTTPS
        $appUrl = config('app.url');
        if ($appUrl && str_starts_with($appUrl, 'https')) {
            \Illuminate\Support\Facades\URL::forceRootUrl($appUrl);
        }
    }
}
