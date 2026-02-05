import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        bio: user.bio || '',
        profil_pic: null,
        _method: 'patch',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informations du Profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour les informations de profil et l'adresse e-mail de votre compte.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Champs firstname, lastname, email comme dans le guide précédent */}
                <div>
                    <InputLabel for="firstname" value="Prénom" />
                    <TextInput
                        id="firstname"
                        className="mt-1 block w-full"
                        value={data.firstname}
                        onChange={(e) => setData('firstname', e.target.value)}
                        required
                        isFocused
                        autoComplete="firstname"
                    />
                    <InputError className="mt-2" message={errors.firstname} />
                </div>

                <div>
                    <InputLabel for="lastname" value="Nom" />
                    <TextInput
                        id="lastname"
                        className="mt-1 block w-full"
                        value={data.lastname}
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                        autoComplete="lastname"
                    />
                    <InputError className="mt-2" message={errors.lastname} />
                </div>

                <div>
                    <InputLabel for="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel for="bio" value="Biographie" />
                    <textarea
                        id="bio"
                        className="mt-1 block w-full border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary rounded-2xl shadow-sm"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.bio} />
                </div>

                <div>
                    <InputLabel for="profil_pic" value="Photo de Profil" />
                    <input
                        type="file"
                        id="profil_pic"
                        className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        onChange={e => setData('profil_pic', e.target.files[0])}
                    />
                    <InputError className="mt-2" message={errors.profil_pic} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Enregistré.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
