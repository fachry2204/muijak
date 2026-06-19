"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Plus, Users, Search, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';

export default function KomisiManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState('');
  const [komisi, setKomisi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', head: '', description: '' });

  const fetchKomisi = async () => {
    try {
      const res = await axios.get('/api/komisi');
      if (res.data.success) {
        setKomisi(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch komisi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomisi();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus komisi ini?')) {
      try {
        await axios.delete(`/api/komisi/${id}`);
        fetchKomisi();
      } catch (error) {
        alert('Gagal menghapus komisi');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/komisi', { ...form, description: content });
      setIsCreating(false);
      setForm({ name: '', head: '', description: '' });
      setContent('');
      fetchKomisi();
    } catch (error) {
      console.error("Failed to save komisi");
    }
  };

  const filteredKomisi = komisi.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    k.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Komisi & Bidang</h1>
          <p className="text-slate-500 mt-1">Kelola data komisi, ketua, deskripsi, dan dokumentasi program kerja.</p>
        </div>
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)} className="bg-[#0F5132] hover:bg-[#167046]">
            <Plus className="w-4 h-4 mr-2" /> Tambah Komisi Baru
          </Button>
        ) : (
          <Button onClick={() => setIsCreating(false)} variant="outline">
            Kembali ke Daftar
          </Button>
        )}
      </div>

      {!isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Komisi Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Cari nama komisi..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-500">Nama Komisi</th>
                    <th className="px-4 py-3 font-medium text-slate-500">Ketua</th>
                    <th className="px-4 py-3 font-medium text-slate-500">Program Kerja</th>
                    <th className="px-4 py-3 font-medium text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                  ) : filteredKomisi.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-slate-500">Tidak ada data komisi.</td></tr>
                  ) : (
                    filteredKomisi.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                        <td className="px-4 py-3">{item.head}</td>
                        <td className="px-4 py-3">{item.members_count || 0} Anggota</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
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
      ) : (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <CardTitle>Form Tambah Komisi</CardTitle>
            <CardDescription>Lengkapi detail komisi beserta program kerjanya</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_komisi">Nama Komisi *</Label>
                  <Input id="nama_komisi" placeholder="Contoh: Komisi Pemberdayaan Ekonomi Umat" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ketua">Nama Ketua *</Label>
                  <Input id="ketua" placeholder="Nama Lengkap & Gelar" required value={form.head} onChange={e => setForm({...form, head: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi / Profil Komisi</Label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>

              <div className="space-y-2">
                <Label>Program Kerja (Optional)</Label>
                <RichTextEditor content={""} onChange={() => {}} />
              </div>

              <div className="space-y-2">
                <Label>Upload Dokumentasi Kegiatan (Images / PDF)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <FolderOpen className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="text-sm font-semibold">Klik atau seret file ke sini</p>
                  <p className="text-xs">Mendukung JPG, PNG, PDF (Max 5MB)</p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan Komisi</Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
