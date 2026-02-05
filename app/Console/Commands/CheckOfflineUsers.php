<?php

namespace App\Console\Commands;

use App\Events\UserStatusUpdated;
use App\Models\User;
use Illuminate\Console\Command;

class CheckOfflineUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:check-offline';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for users who have been inactive and sets them offline.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = now()->subMinutes(5); // 5 minutes of inactivity

        User::where('is_online', true)
            ->where('last_seen_at', '<', $threshold)
            ->get()
            ->each(function (User $user) {
                $user->update(['is_online' => false]);
                broadcast(new UserStatusUpdated($user))->toOthers();
                $this->info("User {$user->username} set offline.");
            });

        $this->info('Offline users check completed.');
    }
}
