<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class GithubController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirect()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback()
    {
        $githubUser = Socialite::driver('github')->user();

        // Find or create user in our database
        $user = User::updateOrCreate([
            'github_id' => $githubUser->id,
        ], [
            'firstname' => explode(' ', $githubUser->name)[0] ?? $githubUser->nickname,
            'lastname' => explode(' ', $githubUser->name)[1] ?? '',
            'username' => $githubUser->nickname,
            'email' => $githubUser->email,
            'profil_pic' => $githubUser->avatar, // GitHub avatar as profile picture
            'password' => Hash::make(str()->random(16)), // Generate a random password
            'role' => 'user',
            'is_online' => true,
        ]);

        Auth::login($user);

        return redirect(env('FRONTEND_URL') . '/dashboard');
    }
}
