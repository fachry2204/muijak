"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Pencil, Trash2, Loader2, MapPin, X } from 'lucide-react';

export default function MuiKotaManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [muiKotaList, setMuiKotaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialForm = {
    kota: '',
    alamat: '',
    no_telp: '',
    anggota: [
      { nama: '', jabatan: '', bidang: '', no_hp: '', status: 'Aktif' }
    ]
  };
  
  const [form, setForm] = useState(initialForm);

  const fetchMuiKota = async () => {
    try {
      const res = await axios.get('/api/muikota');
      if (res.data.success) {
        setMuiKotaList(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch MUI Kota");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuiKota();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus data MUI Kota ini beserta seluruh anggotanya?')) {
      try {
        await axios.delete(`/api/muikota/${id}`);
        fetchMuiKota();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  const handleAddAnggota = () => {
    setForm({
      ...form,
      anggota: [...form.anggota, { nama: '', jabatan: '', bidang: '', no_hp: '', status: 'Aktif' }]
    });
  };

  const handleRemoveAnggota = (index: number) => {
    const newAnggota = [...form.anggota];
    newAnggota.splice(index, 1);
    setForm({ ...form, anggota: newAnggota });
  };

  const handleAnggotaChange = (index: number, field: string, value: string) => {
    const newAnggota = [...form.anggota];
    (newAnggota[index] as any)[field] = value;
    setForm({ ...form, anggota: newAnggota });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/muikota', form);
      setIsCreating(false);
      setForm(initialForm);
      fetchMuiKota();
      alert('Berhasil menyimpan data MUI Kota!');
    } catch (error) {
      console.error("Failed to save MUI Kota");
      alert('Gagal menyimpan data');
    }
  };

  const filteredData = muiKotaList.filter(item => 
    item.kota.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen MUI Kota</h1>
          <p className="text-slate-500 mt-1">Kelola data MUI tingkat Kota Administrasi se-DKI Jakarta beserta daftar anggotanya.</p>
        </div>
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)} className="bg-[#0F5132] hover:bg-[#167046]">
            <Plus className="w-4 h-4 mr-2" /> Tambah MUI Kota
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
            <CardTitle>Daftar MUI Kota Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Cari nama kota..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-500">Nama Kota</th>
                    <th className="px-4 py-3 font-medium text-slate-500">Alamat</th>
                    <th className="px-4 py-3 font-medium text-slate-500">No. Telepon</th>
                    <th className="px-4 py-3 font-medium text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-slate-500">Tidak ada data MUI Kota.</td></tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" /> {item.kota}
                        </td>
                        <td className="px-4 py-3">{item.alamat || '-'}</td>
                        <td className="px-4 py-3">{item.no_telp || '-'}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit">
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="h-8 w-8 p-0" title="Hapus">
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
            <CardTitle>Form Tambah MUI Kota</CardTitle>
            <CardDescription>Lengkapi detail profil MUI Kota beserta daftar anggotanya</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-700 mb-4">Profil MUI Kota</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="kota">Nama Kota *</Label>
                    <Input id="kota" placeholder="Contoh: MUI Kota Jakarta Selatan" required value={form.kota} onChange={e => setForm({...form, kota: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no_telp">No. Telepon</Label>
                    <Input id="no_telp" placeholder="Contoh: 021-1234567" value={form.no_telp} onChange={e => setForm({...form, no_telp: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Input id="alamat" placeholder="Masukkan alamat lengkap kantor..." value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700">Daftar Anggota / Pengurus</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAnggota} className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                    <Plus className="w-4 h-4 mr-1" /> Tambah Anggota
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {form.anggota.map((agt, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-white p-4 rounded-lg border border-slate-200 relative">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Nama Lengkap</Label>
                          <Input required placeholder="Nama anggota..." value={agt.nama} onChange={e => handleAnggotaChange(idx, 'nama', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Jabatan</Label>
                          <Input placeholder="Cth: Ketua Umum" value={agt.jabatan} onChange={e => handleAnggotaChange(idx, 'jabatan', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Bidang</Label>
                          <Input placeholder="Cth: Bidang Fatwa" value={agt.bidang} onChange={e => handleAnggotaChange(idx, 'bidang', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">No Hp</Label>
                          <Input placeholder="Cth: 0812..." value={agt.no_hp} onChange={e => handleAnggotaChange(idx, 'no_hp', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Status</Label>
                          <select 
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={agt.status}
                            onChange={e => handleAnggotaChange(idx, 'status', e.target.value)}
                          >
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                          </select>
                        </div>
                      </div>
                      
                      {form.anggota.length > 1 && (
                        <button type="button" onClick={() => handleRemoveAnggota(idx)} className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-8">Simpan Data</Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
