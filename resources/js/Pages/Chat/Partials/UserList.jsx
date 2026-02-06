import React from 'react';

export default function UserList({ users, onSelectUser, selectedUser, currentUser }) {
    return (
        <div className="space-y-2">
            {users.filter(user => user.id !== currentUser.id).map(user => (
                <div
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200
                        ${selectedUser && selectedUser.id === user.id ? 'bg-primary-light text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100'}
                    `}
                >
                    <div className="relative">
                        <img
                            src={user.profil_pic || 'images/default_avatar.png'} // Default path if no profile picture
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${user.is_online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="ml-3">
                        <p className={`font-semibold ${selectedUser && selectedUser.id === user.id ? 'text-white' : 'text-slate-800'}`}>{user.username}</p>
                        <p className={`text-sm ${selectedUser && selectedUser.id === user.id ? 'text-white' : 'text-slate-500'}`}>
                            {user.is_online ? 'En ligne' : `Vu ${new Date(user.last_seen_at).toLocaleTimeString()}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
