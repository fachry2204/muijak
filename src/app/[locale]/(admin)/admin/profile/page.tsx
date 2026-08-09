'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Camera, KeyRound, Loader2, Mail, Save, ShieldCheck, User } from 'lucide-react';

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url: string | null;
  created_at: string;
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(({ data }) => setProfile(data.data))
      .catch((error) => setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal memuat profil.' }))
      .finally(() => setLoading(false));
  }, []);

  function selectAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak sama.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    const form = new FormData();
    form.append('name', profile.name);
    form.append('email', profile.email);
    form.append('current_password', currentPassword);
    form.append('new_password', newPassword);
    if (avatar) form.append('avatar', avatar);

    try {
      const { data } = await axios.put('/api/profile', form);
      setMessage({ type: 'success', text: data.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      const refreshed = await axios.get('/api/profile');
      setProfile(refreshed.data.data);
      setAvatar(null);
      setPreview('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  if (!profile) return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{message?.text || 'Profil tidak ditemukan.'}</div>;

  const avatarUrl = preview || profile.avatar_url || '';
  const initials = profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-slate-500">Kelola identitas, foto profil, email login, dan keamanan akun.</p>
      </div>

      {message && <div className={`rounded-xl border px-4 py-3 ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="relative mx-auto h-32 w-32">
            {avatarUrl ? <img src={avatarUrl} alt={profile.name} className="h-32 w-32 rounded-full border-4 border-emerald-50 object-cover" /> : <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">{initials}</div>}
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-emerald-600 p-2.5 text-white shadow hover:bg-emerald-700" title="Ganti foto profil">
              <Camera className="h-5 w-5" />
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectAvatar} className="hidden" />
            </label>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">{profile.name}</h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-left text-sm">
            <div className="rounded-lg bg-slate-50 p-3"><ShieldCheck className="mb-1 h-4 w-4 text-emerald-600" /><span className="block text-xs text-slate-400">Hak akses</span><b>{profile.role}</b></div>
            <div className="rounded-lg bg-slate-50 p-3"><CalendarDays className="mb-1 h-4 w-4 text-emerald-600" /><span className="block text-xs text-slate-400">Status</span><b>{profile.status}</b></div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Terdaftar {new Date(profile.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800"><User className="h-5 w-5 text-emerald-600" /> Informasi Akun</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">Nama Lengkap<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">Email Login<div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div></label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800"><KeyRound className="h-5 w-5 text-emerald-600" /> Ubah Kata Sandi</h2>
            <p className="mt-1 text-sm text-slate-500">Kosongkan bagian ini bila tidak ingin mengubah kata sandi.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm font-semibold text-slate-700">Kata Sandi Saat Ini<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">Kata Sandi Baru<input type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" /></label>
            </div>
          </section>

          <div className="flex justify-end"><button disabled={saving} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Simpan Perubahan</button></div>
        </div>
      </form>
    </div>
  );
}
