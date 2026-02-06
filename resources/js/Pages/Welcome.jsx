import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-violet-600 text-white flex flex-col items-center justify-center p-6">
            <Head title="Bienvenue sur Writty" />
            <div className="text-center">
                <h1 className="text-7xl font-extrabold mb-4 font-heading tracking-tighter">Writty</h1>
                <p className="text-xl opacity-90 mb-10 max-w-lg mx-auto font-sans">
                    La messagerie NoSQL nouvelle génération. Connectez-vous et discutez instantanément.
                </p>
                <div className="flex gap-4 justify-center">
                    {auth.user ? (
                        <Link href={route('chat')} className="px-8 py-4 bg-white text-violet-600 rounded-full font-bold shadow-xl hover:scale-105 transition">Accéder au Chat</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="px-8 py-4 bg-white text-violet-600 rounded-full font-bold shadow-xl hover:scale-105 transition">Connexion</Link>
                            <Link href={route('register')} className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-violet-600 transition">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
