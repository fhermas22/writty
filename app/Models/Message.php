<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'messages';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'content',
        'image_url',
        'is_read',
        'type', // 'text' or 'image'
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    // Relation with sender
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Relation with receiver
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
