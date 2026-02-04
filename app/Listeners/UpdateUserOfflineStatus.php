<?php

namespace App\Listeners;

use App\Events\UserStatusUpdated;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateUserOfflineStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        $event->user->update(['is_online' => false, 'last_seen_at' => now()]);
        broadcast(new UserStatusUpdated($event->user))->toOthers();
    }
}
