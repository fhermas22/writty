import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ChatWindow({ currentUser, receiver }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const messagesEndRef = useRef(null);

    const fetchMessages = () => {
        axios.get(`/api/messages/${receiver._id}`).then(response => {
            setMessages(response.data);
        });
    };

    useEffect(() => {
        fetchMessages();

        // Listen for new messages
        window.Echo.private(`chat.${currentUser._id}`)
            .listen('MessageSent', (e) => {
                if (e.message.receiver_id === currentUser._id || e.message.sender_id === currentUser._id) {
                    setMessages(prevMessages => [...prevMessages, e.message]);
                }
            });

        return () => {
            window.Echo.leave(`chat.${currentUser._id}`);
        };
    }, [receiver._id, currentUser._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        if (newMessage) {
            formData.append('content', newMessage);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (!newMessage && !imageFile) {
            setErrors({ content: 'Le message ne peut pas être vide.' });
            return;
        }

        try {
            await axios.post(`/api/messages/${receiver._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setNewMessage('');
            setImageFile(null);
            fetchMessages(); // Re-fetch messages to ensure all are updated and marked as read
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center">
                <img
                    src={receiver.profil_pic || '/default_avatar.png'}
                    alt={receiver.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                    <h3 className="font-semibold text-slate-900">{receiver.username}</h3>
                    <p className="text-sm text-slate-500">
                        {receiver.is_online ? 'En ligne' : `Vu ${new Date(receiver.last_seen_at).toLocaleTimeString()}`}
                    </p>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(message => (
                    <div
                        key={message._id}
                        className={`flex ${message.sender_id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md
                                ${message.sender_id === currentUser._id
                                    ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-none'
                                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}
                            `}
                        >
                            {message.content && <p>{message.content}</p>}
                            {message.image_url && (
                                <img src={message.image_url} alt="Image envoyée" className="max-w-full h-auto rounded-lg mt-2" />
                            )}
                            <span className={`block text-xs mt-1 ${message.sender_id === currentUser._id ? 'text-slate-200' : 'text-slate-400'}`}>
                                {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer p-2 rounded-full hover:bg-slate-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </label>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary rounded-2xl shadow-sm"
                />
                <PrimaryButton type="submit" disabled={!newMessage && !imageFile}>
                    Envoyer
                </PrimaryButton>
                {errors.content && <InputError message={errors.content} className="mt-2" />}
                {errors.image && <InputError message={errors.image} className="mt-2" />}
            </form>
        </div>
    );
}
