import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function UsersIndex({ auth }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users').then(response => {
            setUsers(response.data);
        });

        // Listen for user status updates
        window.Echo.private('users.status')
            .listen('UserStatusUpdated', (e) => {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === e.id ? { ...user, is_online: e.is_online, last_seen_at: e.last_seen_at } : user
                    )
                );
            });

        return () => {
            window.Echo.leave('users.status');
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Tous les Utilisateurs</h1>
                    <div className="bg-white shadow-lg sm:rounded-3xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.filter(user => user.id !== auth.user.id).map(user => (
                                <div key={user.id} className="flex items-center p-4 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                                    <div className="relative">
                                        <img
                                            src={user.profil_pic || 'images/default_avatar.png'}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${user.is_online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-slate-900">{user.username}</h3>
                                        <p className="text-sm text-slate-500">{user.bio || 'Pas de biographie.'}</p>
                                        <Link href={route('chat', user.id)} className="text-primary hover:underline text-sm mt-1 block">Envoyer un message</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
