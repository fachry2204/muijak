"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Map, Share2, Globe, MessageCircle, Camera, Tv, Monitor, Users, ShieldAlert, KeyRound, Plus, Upload, MapPin, AlertTriangle, Loader2, Edit, Trash2, Shield, UserCheck, Lock, Clock, Search, X } from 'lucide-react';

const SettingsMap = dynamic(() => import('@/components/ui/FooterMap'), { ssr: false });

export default function SettingsManagementPage() {
  const [activeTab, setActiveTab] = useState('website');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'ADMIN', status: 'Aktif' });
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Role Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');

  const fetchData = async () => {
    try {
      const [resSettings, resPermissions] = await Promise.all([
        axios.get('/api/settings'),
        axios.get('/api/permissions')
      ]);
      if (resSettings.data.success) {
        setSettings(resSettings.data.data);
      }
      if (resPermissions.data.success) {
        setPermissions(resPermissions.data.data);
      }
    } catch (error) {
      console.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.post('/api/settings', settings);
      if (res.data.success) {
        alert('Pengaturan berhasil disimpan ke database!');
      }
    } catch (error) {
      alert('Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, keyName: string = 'website_logo') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append(keyName, file);
      
      setIsSaving(true);
      try {
        const res = await axios.post('/api/settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          alert('Logo berhasil diunggah dan disimpan!');
          fetchData();
        }
      } catch (error) {
        alert('Gagal mengunggah logo');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTogglePermission = (id: number, role: 'admin_access' | 'editor_access' | 'user_access') => {
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [role]: !p[role] };
      }
      return p;
    }));
  };

  const handleSavePermissions = async () => {
    setIsSavingRole(true);
    try {
      const res = await axios.post('/api/permissions', permissions);
      if (res.data.success) {
        alert('Role & Permissions Berhasil Disimpan ke Database!');
      }
    } catch (error) {
      alert('Gagal menyimpan permissions');
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'ADMIN', status: 'Aktif' });
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status || 'Aktif' });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      alert('Nama dan Email wajib diisi!');
      return;
    }
    if (!editingUser && !userForm.password) {
      alert('Password wajib diisi untuk user baru!');
      return;
    }

    setIsSavingUser(true);
    try {
      if (editingUser) {
        const payload: any = { name: userForm.name, role: userForm.role, status: userForm.status };
        if (userForm.password) payload.password = userForm.password;
        const res = await axios.put(`/api/users/${editingUser.id}`, payload);
        if (res.data.success) {
          alert('User berhasil diperbarui!');
          setUserModalOpen(false);
          fetchUsers();
        }
      } else {
        const res = await axios.post('/api/users', userForm);
        if (res.data.success) {
          alert('User Admin berhasil ditambahkan!');
          setUserModalOpen(false);
          fetchUsers();
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Gagal menyimpan user');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        const res = await axios.delete(`/api/users/${id}`);
        if (res.data.success) {
          alert('User berhasil dihapus');
          fetchUsers();
        }
      } catch (error: any) {
        alert(error.response?.data?.error || 'Gagal menghapus user');
      }
    }
  };

  const handleAddModule = () => {
    if (!newModuleName.trim()) return;
    setPermissions(prev => [
      ...prev,
      { id: Date.now(), module: newModuleName.trim(), admin_access: true, editor_access: false, user_access: false }
    ]);
    setNewModuleName('');
    setRoleModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pengaturan Sistem</h1>
        <p className="text-slate-500 mt-1">Kelola konfigurasi website, akun admin, hak akses, dan keamanan.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-row flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('website')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black transition-all ${activeTab === 'website' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
        >
          <Monitor className="w-5 h-5" /> Website
        </button>
        <button 
          onClick={() => setActiveTab('user')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black transition-all ${activeTab === 'user' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
        >
          <Users className="w-5 h-5" /> User Admin
        </button>
        <button 
          onClick={() => setActiveTab('role')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black transition-all ${activeTab === 'role' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
        >
          <KeyRound className="w-5 h-5" /> Role Akses
        </button>
        <button 
          onClick={() => setActiveTab('security')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black transition-all ${activeTab === 'security' ? 'bg-rose-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
        >
          <ShieldAlert className="w-5 h-5" /> Security
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'website' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
            ) : (
            <form onSubmit={handleSave} className="space-y-6">

        {/* General Info & Logo Header & Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" /> Logo Header
              </CardTitle>
              <CardDescription>Logo yang akan ditampilkan pada bagian Header (sebelah kiri atas).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, 'header_logo')}
                />
                {settings.header_logo || settings.website_logo ? (
                  <img src={settings.header_logo || settings.website_logo} alt="Header Logo" className="max-h-24 object-contain mb-3" />
                ) : (
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-emerald-500" />
                  </div>
                )}
                <p className="text-sm font-bold text-slate-700">Pilih atau letakkan logo header</p>
                <p className="text-xs text-slate-500 mt-1">Format PNG, JPG, atau WebP (Max. 2MB)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" /> Logo Footer
              </CardTitle>
              <CardDescription>Logo yang akan ditampilkan pada bagian Footer (sebelah kiri bawah).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, 'footer_logo')}
                />
                {settings.footer_logo || settings.website_logo ? (
                  <img src={settings.footer_logo || settings.website_logo} alt="Footer Logo" className="max-h-24 object-contain mb-3" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-indigo-500" />
                  </div>
                )}
                <p className="text-sm font-bold text-slate-700">Pilih atau letakkan logo footer</p>
                <p className="text-xs text-slate-500 mt-1">Format PNG, JPG, atau WebP (Max. 2MB)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Mode Maintenance
            </CardTitle>
            <CardDescription>Aktifkan mode ini saat website sedang dalam tahap perbaikan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-4">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer" 
                  checked={settings.maintenance_mode === '1'}
                  onChange={(e) => updateSetting('maintenance_mode', e.target.checked ? '1' : '0')}
                />
              </div>
              <div>
                <Label className="font-bold text-amber-900 text-base cursor-pointer">Aktifkan Maintenance</Label>
                <p className="text-sm text-amber-700 mt-1">Pengunjung umum tidak akan bisa mengakses halaman publik website, kecuali admin yang sedang login.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alamat & Maps Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Informasi Kontak & Lokasi
            </CardTitle>
            <CardDescription>Alamat lengkap dan integrasi peta lokasi (Google Maps).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Alamat Lengkap</Label>
              <textarea 
                className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                rows={3}
                placeholder="Jl. Nama Jalan No. 123, Kelurahan, Kecamatan..."
                value={settings.address || ''}
                onChange={(e) => updateSetting('address', e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Latitude (Opsional)</Label>
                <Input 
                  placeholder="Contoh: -6.1252" 
                  value={settings.map_lat || ''} 
                  onChange={(e) => updateSetting('map_lat', e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Longitude (Opsional)</Label>
                <Input 
                  placeholder="Contoh: 106.8738" 
                  value={settings.map_lng || ''} 
                  onChange={(e) => updateSetting('map_lng', e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pratinjau Peta Lokasi</Label>
              <p className="text-xs text-slate-500">Peta akan otomatis menyesuaikan lokasi berdasarkan alamat atau koordinat di atas.</p>
            </div>
            <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mt-2 relative">
              <SettingsMap 
                address={settings.address}
                lat={settings.map_lat ? parseFloat(settings.map_lat) : undefined}
                lng={settings.map_lng ? parseFloat(settings.map_lng) : undefined}
                zoom={15}
                label="MUI DKI Jakarta"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" /> Tautan Sosial Media
            </CardTitle>
            <CardDescription>Atur link sosial media yang akan terhubung pada tombol bagikan dan footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#1877F2]" /> Facebook Page URL</Label>
              <Input placeholder="https://facebook.com/muidkijakarta" value={settings.social_facebook || ''} onChange={(e) => updateSetting('social_facebook', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X Profile URL</Label>
              <Input placeholder="https://twitter.com/muidkijakarta" value={settings.social_twitter || ''} onChange={(e) => updateSetting('social_twitter', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Camera className="w-4 h-4 text-[#E1306C]" /> Instagram URL</Label>
              <Input placeholder="https://instagram.com/muidkijakarta" value={settings.social_instagram || ''} onChange={(e) => updateSetting('social_instagram', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Tv className="w-4 h-4 text-[#FF0000]" /> Youtube Channel URL</Label>
              <Input placeholder="https://youtube.com/c/muidkijakarta" value={settings.social_youtube || ''} onChange={(e) => updateSetting('social_youtube', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-[#0F5132] hover:bg-[#167046] px-8">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>

            </form>
            )}
          </div>
        )}

      {activeTab === 'user' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Manajemen User Admin</h2>
              <p className="text-slate-500 text-sm mt-1">Tambah, edit, atau hapus akun pengguna yang dapat login ke dashboard admin.</p>
            </div>
            <Button onClick={handleOpenAddUser} className="bg-[#0F5132] hover:bg-[#167046] text-white flex items-center gap-2 shadow-sm font-bold">
              <Plus className="w-4 h-4" /> Tambah User Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total User</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{users.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Administrator</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{users.filter(u => u.role === 'ADMIN').length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">User Aktif</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{users.filter(u => (u.status || 'Aktif') === 'Aktif').length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-base font-bold">Daftar Akun Administrator</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Cari nama atau email..." 
                    className="pl-9 bg-slate-50 border-slate-200"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-bold">
                    <tr>
                      <th className="px-6 py-4">Nama Pengguna</th>
                      <th className="px-6 py-4">Email Login</th>
                      <th className="px-6 py-4 text-center">Hak Akses (Role)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {usersLoading ? (
                      <tr><td colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400 font-medium">Belum ada data user administrator.</td></tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{u.email}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider ${
                              u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                              u.role === 'EDITOR' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              (u.status || 'Aktif') === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              {u.status || 'Aktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenEditUser(u)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit User">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus User">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'role' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Hak Akses (Role)</CardTitle>
              <CardDescription>Tentukan menu apa saja yang dapat diakses oleh masing-masing grup user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Konfigurasi menu yang dapat diakses oleh masing-masing Role (Hak Akses).</p>
                  <Button size="sm" onClick={() => setRoleModalOpen(true)} className="bg-[#0F5132] hover:bg-[#167046] text-white font-bold">
                    <Plus className="w-4 h-4 mr-1" /> Tambah Modul Role
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-700">Modul / Halaman</th>
                        <th className="px-6 py-4 text-center">
                          <div className="font-bold text-slate-800">ADMIN</div>
                          <div className="text-xs font-normal text-slate-400 mt-0.5">Full Access</div>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <div className="font-bold text-slate-800">EDITOR</div>
                          <div className="text-xs font-normal text-slate-400 mt-0.5">Content Only</div>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <div className="font-bold text-slate-800">USER</div>
                          <div className="text-xs font-normal text-slate-400 mt-0.5">View Only</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /></td></tr>
                      ) : permissions.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-700">{row.module}</td>
                          <td className="px-6 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={!!row.admin_access} 
                              onChange={() => handleTogglePermission(row.id, 'admin_access')}
                              disabled={row.module === "Pengaturan Sistem"} 
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={!!row.editor_access} 
                              onChange={() => handleTogglePermission(row.id, 'editor_access')}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={!!row.user_access} 
                              onChange={() => handleTogglePermission(row.id, 'user_access')}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleSavePermissions} disabled={isSavingRole} className="bg-amber-500 hover:bg-amber-600 px-8 font-bold">
                    {isSavingRole ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSavingRole ? 'Menyimpan...' : 'Simpan Konfigurasi Role'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Sesi & Batas Login
                </CardTitle>
                <CardDescription>Atur batas waktu otomatis habis masa berlaku sesi dan proteksi brute force login.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Durasi Sesi Login (Session Timeout)</Label>
                    <select 
                      className="w-full border border-slate-200 rounded-md p-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={settings.security_session_timeout || '8h'}
                      onChange={(e) => updateSetting('security_session_timeout', e.target.value)}
                    >
                      <option value="15m">15 Menit</option>
                      <option value="30m">30 Menit</option>
                      <option value="1h">1 Jam</option>
                      <option value="8h">8 Jam (Default)</option>
                      <option value="24h">24 Jam</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Batas Percobaan Login Gagal (Max Attempts)</Label>
                    <select 
                      className="w-full border border-slate-200 rounded-md p-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={settings.security_max_login_attempts || '5'}
                      onChange={(e) => updateSetting('security_max_login_attempts', e.target.value)}
                    >
                      <option value="3">3 Kali Percobaan</option>
                      <option value="5">5 Kali Percobaan (Rekomendasi)</option>
                      <option value="10">10 Kali Percobaan</option>
                      <option value="unlimited">Tanpa Batas</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" /> Kebijakan Password & Audit Log
                </CardTitle>
                <CardDescription>Tingkatkan standar keamanan password dan pencatatan aktivitas pengguna.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-bold text-slate-800 cursor-pointer">Minimal Panjang Password</Label>
                      <p className="text-xs text-slate-500">Mewajibkan jumlah karakter minimal saat membuat/mengubah password.</p>
                    </div>
                    <select 
                      className="border border-slate-200 rounded-md p-2 text-sm bg-white"
                      value={settings.security_min_password_len || '6'}
                      onChange={(e) => updateSetting('security_min_password_len', e.target.value)}
                    >
                      <option value="6">6 Karakter</option>
                      <option value="8">8 Karakter</option>
                      <option value="12">12 Karakter</option>
                    </select>
                  </div>

                  <hr className="border-slate-200" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-bold text-slate-800 cursor-pointer">Wajibkan Kombinasi Huruf & Angka</Label>
                      <p className="text-xs text-slate-500">Password pengguna harus mengandung kombinasi huruf besar/kecil dan angka.</p>
                    </div>
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      checked={settings.security_require_mixed === '1'}
                      onChange={(e) => updateSetting('security_require_mixed', e.target.checked ? '1' : '0')}
                    />
                  </div>

                  <hr className="border-slate-200" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-bold text-slate-800 cursor-pointer">Aktifkan Catatan Log Aktivitas (Audit Log)</Label>
                      <p className="text-xs text-slate-500">Mencatat aktivitas login dan perubahan data penting oleh admin.</p>
                    </div>
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      checked={settings.security_enable_audit_log === '1'}
                      onChange={(e) => updateSetting('security_enable_audit_log', e.target.checked ? '1' : '0')}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving} className="bg-rose-600 hover:bg-rose-700 text-white px-8 font-bold">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi Keamanan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      )}
      </div>

      {/* User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-800">
                {editingUser ? 'Edit User Admin' : 'Tambah User Admin Baru'}
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-slate-700 font-bold text-sm">Nama Lengkap</Label>
                <Input 
                  required 
                  placeholder="Masukkan nama pengguna..." 
                  value={userForm.name} 
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))} 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-700 font-bold text-sm">Email Login</Label>
                <Input 
                  required 
                  type="email" 
                  placeholder="nama@muijakarta.or.id" 
                  disabled={!!editingUser}
                  value={userForm.email} 
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))} 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-700 font-bold text-sm">
                  {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                </Label>
                <Input 
                  type="password" 
                  required={!editingUser}
                  placeholder="Password..." 
                  value={userForm.password} 
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-slate-700 font-bold text-sm">Role (Hak Akses)</Label>
                  <select 
                    className="w-full border border-slate-200 rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="ADMIN">ADMIN (Full Access)</option>
                    <option value="EDITOR">EDITOR (Content Only)</option>
                    <option value="USER">USER (View Only)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-700 font-bold text-sm">Status Akun</Label>
                  <select 
                    className="w-full border border-slate-200 rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setUserModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSavingUser} className="bg-[#0F5132] hover:bg-[#167046] text-white">
                  {isSavingUser ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Tambah Modul Role Baru</h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-bold text-sm">Nama Modul / Halaman</Label>
              <Input 
                placeholder="Contoh: Modul Laporan Keuangan" 
                value={newModuleName} 
                onChange={(e) => setNewModuleName(e.target.value)} 
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setRoleModalOpen(false)}>Batal</Button>
              <Button onClick={handleAddModule} className="bg-emerald-600 hover:bg-emerald-700 text-white">Tambah Modul</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
