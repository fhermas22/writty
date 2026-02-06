import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-12 px-4 max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Heureux de vous revoir, {auth.user.firstname} !</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                            <h3 className="font-bold text-cyan-900 mb-2">Messagerie</h3>
                            <p className="text-cyan-700 text-sm mb-4">Reprenez vos conversations en cours.</p>
                            <Link href={route('chat')} className="text-cyan-600 font-bold hover:underline">Ouvrir le chat →</Link>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
