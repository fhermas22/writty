<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get overall platform statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        $totalUsers = User::count();
        $onlineUsers = User::where('is_online', true)->count();
        $totalMessages = Message::count();
        $messagesToday = Message::where('created_at', '>=', now()->startOfDay())->count();

        return response()->json([
            'total_users' => $totalUsers,
            'online_users' => $onlineUsers,
            'total_messages' => $totalMessages,
            'messages_today' => $messagesToday,
        ]);
    }

    /**
     * Get a list of all users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function allUsers()
    {
        return response()->json(User::all(['_id', 'firstname', 'lastname', 'username', 'email', 'role', 'is_online', 'created_at']));
    }

    /**
     * Delete a user by ID.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    /**
     * Get message logs (e.g., last 100 messages).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function messageLogs()
    {
        return response()->json(Message::orderBy('created_at', 'desc')->take(100)->get());
    }
}
