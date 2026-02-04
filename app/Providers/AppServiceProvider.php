<?php

namespace App\Providers;

use App\Listeners\UpdateUserOfflineStatus;
use App\Listeners\UpdateUserOnlineStatus;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Event;
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

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Registering Auth Event Listeners
        Event::listen(
            Login::class,
            [UpdateUserOnlineStatus::class, 'handle']
        );

        Event::listen(
            Logout::class,
            [UpdateUserOfflineStatus::class, 'handle']
        );
    }
}
