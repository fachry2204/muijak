"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Shield, UserCheck, ShieldAlert, Loader2, Save, X } from 'lucide-react';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'ADMIN', status: 'Aktif' });
  const [isSavingUser, setIsSavingUser] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (id: number) => {
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

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const activeCount = users.filter(u => (u.status || 'Aktif') === 'Aktif').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Data User</h1>
          <p className="text-slate-500 mt-1">Kelola akun pengguna, berikan hak akses, dan tambah admin baru.</p>
        </div>
        <Button onClick={handleOpenAddUser} className="bg-[#0F5132] hover:bg-[#167046] text-white flex items-center gap-2 shadow-sm font-bold">
          <Plus className="w-4 h-4" /> Tambah User Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Total User Aktif</p>
                <h3 className="text-2xl font-bold text-slate-800">{activeCount}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Administrator</p>
                <h3 className="text-2xl font-bold text-slate-800">{adminCount}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Total User Terdaftar</p>
                <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg">Daftar Akun Pengguna</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Cari nama atau email..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Hak Akses (Role)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Login Terakhir</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data user.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                      <td className="px-6 py-4 text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'EDITOR' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          (user.status || 'Aktif') === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {user.status || 'Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {user.lastLogin || (user.created_at ? new Date(user.created_at).toLocaleDateString() : '-')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEditUser(user)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit User">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus User">
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
                <Button type="submit" disabled={isSavingUser} className="bg-[#0F5132] hover:bg-[#167046] text-white font-bold">
                  {isSavingUser ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
