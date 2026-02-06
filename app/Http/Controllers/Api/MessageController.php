<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    /**
     * Get messages between two users.
     *
     * @param  string  $receiverId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(string $receiverId)
    {
        $user = Auth::user();

        $myId = (string) $user->id;

        Log::info("Chat entre " . $myId . " et " . $receiverId);

        $messages = Message::where(function ($query) use ($myId, $receiverId) {
            $query->where('sender_id', $myId)
                ->where('receiver_id', $receiverId);
        })
        ->orWhere(function ($query) use ($myId, $receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', $myId);
        })
        ->orderBy('created_at', 'asc')
        ->get();


        // dd($messages->toArray());

        // Mark messages as read if the current user is the receiver
        Message::where("sender_id", $receiverId)
            ->where("receiver_id", $user->_id)
            ->where("is_read", false)
            ->update(["is_read" => true]);

        return response()->json($messages);
    }

    /**
     * Send a new message.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $receiverId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, string $receiverId)
    {
        $receiver = User::where('_id', $receiverId)->orWhere('id', $receiverId)->first();

        if (!$receiver) {
            // \Log::error("Destinataire introuvable pour l'ID : " . $receiverId);
            return response()->json(['message' => 'Destinataire non trouvé'], 404);
        }

        $request->validate([
            'content' => 'nullable|string|max:2000',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $user = Auth::user();
        $receiver = User::find($receiverId);

        if (!$receiver) {
            return response()->json(['message' => 'Destinataire non trouvé'], 404);
        }

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chat_images', 'public');
            $imageUrl = Storage::url($path);
        }

        $message = Message::create([
            'sender_id' => $user->_id,
            'receiver_id' => $receiverId,
            'content' => $request->content,
            'image_url' => $imageUrl,
            'type' => $imageUrl ? 'image' : 'text',
            'is_read' => false,
        ]);

        // Broadcast the message
        broadcast(new MessageSent($user, $message->load('sender')))->toOthers();

        return response()->json($message->load('sender'), 201);
    }

    /**
     * List of users for the chat
     */
    public function users()
    {
        $users = User::where('_id', '!=', auth()->id())->get();

        return response()->json($users);
    }

    /**
     * Get a specific user by ID.
     */
    public function showUser(string $id)
    {
        $user = User::where('_id', $id)->orWhere('id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json($user);
    }
}
