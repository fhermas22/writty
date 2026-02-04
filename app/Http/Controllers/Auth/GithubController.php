<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GithubController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('github')->redirect();
    }

    public function callback()
    {
        $githubUser = Socialite::driver('github')->user();

        $user = User::updateOrCreate([
            'github_id' => $githubUser->id,
        ], [
            'firstname' => explode(' ', $githubUser->name)[0] ?? $githubUser->nickname,
            'lastname' => explode(' ', $githubUser->name)[1] ?? '',
            'username' => $githubUser->nickname,
            'email' => $githubUser->email,
            'profil_pic' => $githubUser->avatar,
            'password' => bcrypt(str()->random(16)),
        ]);

        Auth::login($user);

        return redirect(env('FRONTEND_URL') . '/dashboard');
    }
}
