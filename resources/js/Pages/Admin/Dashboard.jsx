import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-6 border border-slate-100">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-extrabold text-slate-900">{value}</p>
        </div>
    </div>
);

export default function AdminDashboard({ auth }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/stats').then(response => {
            setStats(response.data);
        });
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tableau de Bord Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Statistiques de la Plateforme</h1>
                    {stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <StatCard title="Utilisateurs Totaux" value={stats.total_users} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.486c.362.087.706.228 1.01.428m-4.4-4.28a3 3 0 11-5.356-1.857m5.356 1.857a3 3 0 005.356-1.857m0 0a3 3 0 115.356 1.857m-5.356-1.857a3 3 0 01-5.356 1.857" /></svg>} />
                            <StatCard title="Utilisateurs en Ligne" value={stats.online_users} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M12 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>} />
                            <StatCard title="Messages Totaux" value={stats.total_messages} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} />
                            <StatCard title="Messages Aujourd'hui" value={stats.messages_today} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                        </div>
                    ) : <p>Chargement des statistiques...</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
