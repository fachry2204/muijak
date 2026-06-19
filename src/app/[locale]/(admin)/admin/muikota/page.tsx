"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Pencil, Trash2, Loader2, MapPin, X, Download, Upload, CheckCircle, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500">Memuat Peta...</div>
});

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MuiKotaManagementPage() {
  const params = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [muiKotaList, setMuiKotaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialForm = {
    kota: '',
    alamat: '',
    no_telp: '',
    map_lat: -6.200000,
    map_lng: 106.816666,
    pimpinan: [
      { nama: '', jabatan: '', no_hp: '' }
    ],
    anggota: [
      { nama: '', jabatan: '', bidang: '', no_hp: '' }
    ]
  };
  
  const [form, setForm] = useState(initialForm);
  const [importStats, setImportStats] = useState<{ total: number, pimpinan: number, anggota: number } | null>(null);

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Kategori: 'Pimpinan', 'Nama Lengkap': 'John Doe', Jabatan: 'Ketua Umum', Bidang: '', 'No Handphone': '08123456789' },
      { Kategori: 'Anggota', 'Nama Lengkap': 'Jane Doe', Jabatan: 'Ketua', Bidang: 'Bidang Fatwa', 'No Handphone': '08987654321' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_MUI_Kota");
    XLSX.writeFile(wb, "Template_Import_MUI_Kota.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const newPimpinan: any[] = [];
      const newAnggota: any[] = [];

      data.forEach((row: any) => {
        const kategori = (row.Kategori || '').toString().trim().toLowerCase();
        const nama = row['Nama Lengkap'] || '';
        const jabatan = row.Jabatan || '';
        const bidang = row.Bidang || '';
        const no_hp = row['No Handphone'] || '';

        if (!nama) return;

        if (kategori === 'pimpinan') {
          newPimpinan.push({ nama, jabatan, no_hp });
        } else {
          newAnggota.push({ nama, jabatan, bidang, no_hp });
        }
      });

      if (newPimpinan.length > 0 || newAnggota.length > 0) {
        setForm(prev => ({
          ...prev,
          pimpinan: newPimpinan.length > 0 ? newPimpinan : prev.pimpinan,
          anggota: newAnggota.length > 0 ? newAnggota : prev.anggota
        }));

        setImportStats({
          total: newPimpinan.length + newAnggota.length,
          pimpinan: newPimpinan.length,
          anggota: newAnggota.length
        });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

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
      anggota: [...form.anggota, { nama: '', jabatan: '', bidang: '', no_hp: '' }]
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

  const handleAddPimpinan = () => {
    setForm({
      ...form,
      pimpinan: [...form.pimpinan, { nama: '', jabatan: '', no_hp: '' }]
    });
  };

  const handleRemovePimpinan = (index: number) => {
    const newPimpinan = [...form.pimpinan];
    newPimpinan.splice(index, 1);
    setForm({ ...form, pimpinan: newPimpinan });
  };

  const handlePimpinanChange = (index: number, field: string, value: string) => {
    const newPimpinan = [...form.pimpinan];
    (newPimpinan[index] as any)[field] = value;
    setForm({ ...form, pimpinan: newPimpinan });
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await axios.get(`/api/muikota/${id}`);
      if (res.data.success) {
        const data = res.data.data;
        const pimpinan = data.anggota.filter((a: any) => a.status === 'Pimpinan');
        const anggota = data.anggota.filter((a: any) => a.status !== 'Pimpinan');
        
        setForm({
          kota: data.kota,
          alamat: data.alamat,
          no_telp: data.no_telp,
          map_lat: data.map_lat || -6.200000,
          map_lng: data.map_lng || 106.816666,
          pimpinan: pimpinan.length > 0 ? pimpinan : [{ nama: '', jabatan: '', no_hp: '' }],
          anggota: anggota.length > 0 ? anggota : [{ nama: '', jabatan: '', bidang: '', no_hp: '' }]
        });
        setEditingId(id);
        setIsCreating(true);
      }
    } catch (error) {
      alert('Gagal mengambil data untuk diedit');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        pimpinan: form.pimpinan.filter(p => p.nama.trim() !== ''),
        anggota: form.anggota.filter(a => a.nama.trim() !== '')
      };

      if (editingId) {
        await axios.put(`/api/muikota/${editingId}`, payload);
        alert('Berhasil mengupdate data MUI Kota!');
      } else {
        await axios.post('/api/muikota', payload);
        alert('Berhasil menyimpan data MUI Kota!');
      }
      setIsCreating(false);
      setEditingId(null);
      setForm(initialForm);
      fetchMuiKota();
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
          <Button onClick={() => { setIsCreating(true); setEditingId(null); setForm(initialForm); }} className="bg-[#0F5132] hover:bg-[#167046]">
            <Plus className="w-4 h-4 mr-2" /> Tambah MUI Kota
          </Button>
        ) : (
          <Button onClick={() => { setIsCreating(false); setEditingId(null); setForm(initialForm); }} variant="outline">
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
                            <Link href={`/${params.locale}/admin/muikota/${item.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Lihat Data">
                                <Eye className="w-4 h-4 text-emerald-600" />
                              </Button>
                            </Link>
                            <Button onClick={() => handleEdit(item.id)} variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit">
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
            <CardTitle>{editingId ? 'Edit MUI Kota' : 'Form Tambah MUI Kota'}</CardTitle>
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
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <Label>Pin Lokasi Peta (Otomatis / Geser manual)</Label>
                    <span className="text-xs text-slate-500">
                      {Number(form.map_lat || -6.200000).toFixed(6)}, {Number(form.map_lng || 106.816666).toFixed(6)}
                    </span>
                  </div>
                  <MapPicker 
                    lat={Number(form.map_lat || -6.200000)} 
                    lng={Number(form.map_lng || 106.816666)} 
                    address={form.alamat} 
                    onChange={(lat, lng) => setForm({ ...form, map_lat: lat, map_lng: lng })}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h3 className="font-bold text-slate-700">Daftar Kepengurusan (Pimpinan & Anggota)</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={downloadTemplate} variant="outline" size="sm" className="bg-slate-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" /> Template Excel
                    </Button>
                    <Label htmlFor="excel-upload-muikota" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 h-8 px-3">
                      <Upload className="w-4 h-4 mr-2" /> Import Excel
                      <input id="excel-upload-muikota" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 mt-6">
                  <h3 className="font-bold text-slate-700">Daftar Pimpinan</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPimpinan} className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                    <Plus className="w-4 h-4 mr-1" /> Tambah Pimpinan
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {form.pimpinan.map((pim, idx) => (
                    <div key={`pim-${idx}`} className="flex gap-4 items-start bg-white p-4 rounded-lg border border-slate-200 relative">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Nama Lengkap</Label>
                          <Input placeholder="Nama pimpinan..." value={pim.nama} onChange={e => handlePimpinanChange(idx, 'nama', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Jabatan</Label>
                          <Input placeholder="Cth: Ketua Umum" value={pim.jabatan} onChange={e => handlePimpinanChange(idx, 'jabatan', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">No Hp</Label>
                          <Input placeholder="Cth: 0812..." value={pim.no_hp} onChange={e => handlePimpinanChange(idx, 'no_hp', e.target.value)} />
                        </div>
                      </div>
                      
                      {form.pimpinan.length > 1 && (
                        <button type="button" onClick={() => handleRemovePimpinan(idx)} className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
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
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Nama Lengkap</Label>
                          <Input placeholder="Nama anggota..." value={agt.nama} onChange={e => handleAnggotaChange(idx, 'nama', e.target.value)} />
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
                <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); setForm(initialForm); }}>Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-8">Simpan Data</Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}



      {/* Modal Import Success */}
      {importStats && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-[400px] animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Import Berhasil!</h3>
            <p className="text-center text-slate-500 mb-6 text-sm">Data kepengurusan telah berhasil dimuat dari file Excel.</p>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 mb-6 border border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Pimpinan</span>
                <span className="font-bold text-slate-700">{importStats.pimpinan} Orang</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Anggota Bidang</span>
                <span className="font-bold text-slate-700">{importStats.anggota} Orang</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Total Import</span>
                <span className="font-bold text-emerald-600 text-lg">{importStats.total}</span>
              </div>
            </div>
            
            <Button onClick={() => setImportStats(null)} type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-white font-bold">
              Tutup & Lanjutkan
            </Button>
          </div>
        </div>
      )}



    </div>
  );
}
