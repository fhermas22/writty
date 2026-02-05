import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import UserList from './Partials/UserList';
import ChatWindow from './Partials/ChatWindow';

export default function Chat({ auth, receiverId: initialReceiverId }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch all users to display in the sidebar
        axios.get('/api/users').then(response => {
            setUsers(response.data);
        });

        // If an initial receiverId is provided (e.g., from a direct link),
        // select that user once the users list is loaded.
        if (initialReceiverId) {
            axios.get(`/api/users/${initialReceiverId}`).then(response => {
                setSelectedUser(response.data);
            });
        }

        // Listen for user status updates
        window.Echo.private('users.status')
            .listen('UserStatusUpdated', (e) => {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === e.id ? { ...user, is_online: e.is_online, last_seen_at: e.last_seen_at } : user
                    )
                );
                if (selectedUser && selectedUser._id === e.id) {
                    setSelectedUser(prevSelected => ({ ...prevSelected, is_online: e.is_online, last_seen_at: e.last_seen_at }));
                }
            });

        return () => {
            window.Echo.leave('users.status');
        };
    }, [initialReceiverId, selectedUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Messagerie" />

            <div className="flex h-[calc(100vh-64px)]">
                {/* Sidebar for users list */}
                <div className="w-1/4 bg-white border-r border-slate-200 p-4 overflow-y-auto">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Conversations</h2>
                    <UserList users={users} onSelectUser={handleUserSelect} selectedUser={selectedUser} currentUser={auth.user} />
                </div>

                {/* Chat window */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <ChatWindow currentUser={auth.user} receiver={selectedUser} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            Sélectionnez un utilisateur pour commencer à discuter.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
