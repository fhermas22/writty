<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin {email?} {--promote}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user or promote an existing user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? $this->ask('Email ?');

        if ($this->option('promote')) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->update(['role' => 'admin']);
                $this->info("User promoted to admin!");
            }
            return;
        }

        User::create([
            'firstname' => $this->ask('Firstname ?'),
            'lastname' => $this->ask('Lastname ?'),
            'username' => $this->ask('Username ?'),
            'email' => $email,
            'password' => Hash::make($this->secret('Password ?')),
            'role' => 'admin',
        ]);

        $this->info("Admin created successfully!");
    }
}
