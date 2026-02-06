<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Reverb\Events\MessageSent as EventsMessageSent;

class ChatController extends Controller
{
    // Retrieve messages between two users
    public function index($userId)
    {
        return Message::where(function($q) use ($userId) {
                $q->where('sender_id', auth()->id())->where('receiver_id', $userId);
            })->orWhere(function($q) use ($userId) {
                $q->where('sender_id', $userId)->where('receiver_id', auth()->id());
            })->orderBy('created_at', 'asc')->get();
    }

    // Send a message
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required',
            'content' => 'required_without:image',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chat_images', 'public');
            $imageUrl = Storage::url($path);
        }

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'image_url' => $imageUrl,
            'type' => $imageUrl ? 'image' : 'text',
            'is_read' => false,
        ]);

        broadcast(new EventsMessageSent($message, auth()->id()))->toOthers();

        return response()->json($message);
    }

    // List of users for the chat
    public function users()
    {
        return User::where('_id', '!=', auth()->id())
                   ->select('firstname', 'lastname', 'username', 'profil_pic', 'is_online')
                   ->get()
                   ->values();
    }
}
