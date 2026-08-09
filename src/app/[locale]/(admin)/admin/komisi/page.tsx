"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Plus, Users, Search, Pencil, Trash2, FolderOpen, Loader2, Download, Upload, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function KomisiManagementPage() {
  const params = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [komisi, setKomisi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [members, setMembers] = useState([{ nama: '', jabatan: '', no_hp: '' }]);
  const [subKomisi, setSubKomisi] = useState([{ name: '', members: [{ nama: '', jabatan: '', no_hp: '' }] }]);
  const [importStats, setImportStats] = useState<{ total: number, bidang: number, divisi: number } | null>(null);

  const handleAddMember = () => setMembers([...members, { nama: '', jabatan: '', no_hp: '' }]);
  const handleRemoveMember = (index: number) => setMembers(members.filter((_, i) => i !== index));
  const updateMember = (index: number, field: string, value: string) => {
    const newMembers: any[] = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleAddSubKomisi = () => setSubKomisi([...subKomisi, { name: '', members: [{ nama: '', jabatan: '', no_hp: '' }] }]);
  const handleRemoveSubKomisi = (index: number) => setSubKomisi(subKomisi.filter((_, i) => i !== index));
  const updateSubKomisiName = (index: number, name: string) => {
    const newSub = [...subKomisi];
    newSub[index].name = name;
    setSubKomisi(newSub);
  };
  const handleAddSubKomisiMember = (komisiIndex: number) => {
    const newSub = [...subKomisi];
    newSub[komisiIndex].members.push({ nama: '', jabatan: '', no_hp: '' });
    setSubKomisi(newSub);
  };
  const handleRemoveSubKomisiMember = (komisiIndex: number, memberIndex: number) => {
    const newSub = [...subKomisi];
    newSub[komisiIndex].members = newSub[komisiIndex].members.filter((_, i) => i !== memberIndex);
    setSubKomisi(newSub);
  };
  const updateSubKomisiMember = (komisiIndex: number, memberIndex: number, field: string, value: string) => {
    const newSub = [...subKomisi];
    (newSub[komisiIndex].members[memberIndex] as any)[field] = value;
    setSubKomisi(newSub);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Kategori: 'Bidang', 'Nama Komisi / Divisi': '', 'Nama Lengkap': 'John Doe', Jabatan: 'Ketua Bidang', 'No Handphone': '08123456789' },
      { Kategori: 'Divisi', 'Nama Komisi / Divisi': 'Divisi Fatwa', 'Nama Lengkap': 'Jane Doe', Jabatan: 'Ketua Divisi', 'No Handphone': '08987654321' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Anggota");
    XLSX.writeFile(wb, "Template_Import_Anggota.xlsx");
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

      const newMembers: any[] = [];
      const subMap = new Map();

      data.forEach((row: any) => {
        const kategori = (row.Kategori || '').toString().trim().toLowerCase();
        const nama = row['Nama Lengkap'] || '';
        const jabatan = row.Jabatan || '';
        const no_hp = row['No Handphone'] || '';
        const subName = row['Nama Komisi / Divisi'] || '';

        if (!nama) return;

        if (kategori === 'divisi' || kategori === 'komisi' || subName) {
          if (!subMap.has(subName)) subMap.set(subName, []);
          subMap.get(subName).push({ nama, jabatan, no_hp });
        } else {
          newMembers.push({ nama, jabatan, no_hp });
        }
      });

      if (newMembers.length > 0) {
        setMembers(prev => {
          const validPrev = prev.filter(p => p.nama.trim() !== '');
          return [...validPrev, ...newMembers];
        });
      }
      
      const newSubKomisi = Array.from(subMap.entries()).map(([name, membersArr]) => ({
        name,
        members: membersArr
      }));

      if (newSubKomisi.length > 0) {
        setSubKomisi(prev => {
          const updated = [...prev];
          newSubKomisi.forEach(newSub => {
            const existingIdx = updated.findIndex(u => u.name.toLowerCase() === newSub.name.toLowerCase());
            if (existingIdx >= 0) {
              const validPrevMembers = updated[existingIdx].members.filter((m: any) => m.nama.trim() !== '');
              updated[existingIdx].members = [...validPrevMembers, ...newSub.members];
            } else {
              updated.push(newSub);
            }
          });
          return updated.filter(u => u.name.trim() !== '' || u.members.some((m: any) => m.nama.trim() !== ''));
        });
      }

      const totalBidang = newMembers.length;
      const totalDivisi = Array.from(subMap.values()).reduce((sum: number, arr: any) => sum + arr.length, 0);

      setImportStats({
        total: totalBidang + totalDivisi,
        bidang: totalBidang,
        divisi: totalDivisi
      });
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

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

  const handleEdit = async (id: number) => {
    try {
      const res = await axios.get(`/api/komisi/${id}`);
      if (res.data.success) {
        const data = res.data.data;
        setForm({ name: data.name, description: data.description || '' });
        
        const anggotaData = data.anggota || [];
        const mainMembers = anggotaData.filter((a: any) => !a.sub_komisi_name).map((a: any) => ({
          nama: a.nama, jabatan: a.jabatan, no_hp: a.no_hp
        }));
        
        if (mainMembers.length > 0) setMembers(mainMembers);
        else setMembers([{ nama: '', jabatan: '', no_hp: '' }]);

        const subKomisiMap = new Map();
        anggotaData.filter((a: any) => a.sub_komisi_name).forEach((a: any) => {
          if (!subKomisiMap.has(a.sub_komisi_name)) {
            subKomisiMap.set(a.sub_komisi_name, []);
          }
          subKomisiMap.get(a.sub_komisi_name).push({ nama: a.nama, jabatan: a.jabatan, no_hp: a.no_hp });
        });

        const subKomisiArr = Array.from(subKomisiMap.entries()).map(([name, members]) => ({
          name, members
        }));

        if (subKomisiArr.length > 0) setSubKomisi(subKomisiArr);
        else setSubKomisi([{ name: '', members: [{ nama: '', jabatan: '', no_hp: '' }] }]);

        setEditingId(id);
        setIsCreating(true);
      }
    } catch (error) {
      alert('Gagal mengambil data komisi');
    }
  };

  useEffect(() => {
    fetchKomisi();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus komisi ini?')) {
      try {
        await axios.delete(`/api/komisi/${id}`);
        fetchKomisi();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Gagal menghapus komisi');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/komisi/${editingId}`, { ...form, description: '', members, subKomisi });
      } else {
        await axios.post('/api/komisi', { ...form, description: '', members, subKomisi });
      }
      resetForm();
      fetchKomisi();
    } catch (error) {
      console.error("Failed to save komisi");
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({ name: '', description: '' });
    setMembers([{ nama: '', jabatan: '', no_hp: '' }]);
    setSubKomisi([{ name: '', members: [{ nama: '', jabatan: '', no_hp: '' }] }]);
  };

  const filteredKomisi = komisi.filter(k =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Bidang & Komisi</h1>
          <p className="text-slate-500 mt-1">Kelola data bidang & komisi, ketua, deskripsi, dan dokumentasi program kerja.</p>
        </div>
        {!isCreating ? (
          <Button onClick={() => { resetForm(); setIsCreating(true); }} className="bg-[#0F5132] hover:bg-[#167046]">
            <Plus className="w-4 h-4 mr-2" /> Tambah Bidang & Komisi Baru
          </Button>
        ) : (
          <Button onClick={resetForm} variant="outline">
            Kembali ke Daftar
          </Button>
        )}
      </div>

      {!isCreating ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-100 font-medium mb-1">Total Bidang & Komisi</p>
                    <h3 className="text-4xl font-bold">{komisi.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 font-medium mb-1">Total Anggota Terdaftar</p>
                    <h3 className="text-4xl font-bold">
                      {komisi.reduce((acc, curr) => acc + (curr.members_count || 0), 0)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Bidang & Komisi Terdaftar</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Cari nama bidang & komisi..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-500">Nama Bidang & Komisi</th>
                    <th className="px-4 py-3 font-medium text-slate-500">Total Anggota</th>
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
                        <td className="px-4 py-3">{item.members_count || 0} Anggota</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/${params.locale}/admin/komisi/${item.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Lihat Data">
                                <Eye className="w-4 h-4 text-emerald-600" />
                              </Button>
                            </Link>
                            <Button onClick={() => handleEdit(item.id)} variant="outline" size="sm" className="h-8 w-8 p-0">
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
        </div>
      ) : (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <CardTitle>{editingId ? 'Form Edit Bidang & Komisi' : 'Form Tambah Bidang & Komisi'}</CardTitle>
            <CardDescription>Lengkapi detail struktur dan tambahkan daftar anggota</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_komisi">Nama Bidang / Komisi *</Label>
                  <Input id="nama_komisi" placeholder="Contoh: Komisi Pemberdayaan Ekonomi Umat" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <Label className="text-lg font-bold">Daftar Anggota Bidang</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={downloadTemplate} variant="outline" size="sm" className="bg-slate-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" /> Template Excel
                    </Button>
                    <Label htmlFor="excel-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 h-8 px-3">
                      <Upload className="w-4 h-4 mr-2" /> Import Excel
                      <input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                    </Label>
                    <Button type="button" onClick={handleAddMember} variant="outline" size="sm" className="bg-slate-50">
                      <Plus className="w-4 h-4 mr-2" /> Tambah Anggota Bidang
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {members.map((member, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Nama Lengkap</Label>
                        <Input placeholder="Nama lengkap..." value={member.nama} onChange={e => updateMember(idx, 'nama', e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Jabatan</Label>
                        <Input placeholder="Misal: Sekretaris, Anggota..." value={member.jabatan} onChange={e => updateMember(idx, 'jabatan', e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">No Handphone</Label>
                        <Input placeholder="Opsional" value={member.no_hp} onChange={e => updateMember(idx, 'no_hp', e.target.value)} />
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveMember(idx)} className="h-10 w-10 shrink-0" disabled={members.length === 1}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Komisi / Divisi */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-bold">Daftar Komisi / Divisi</Label>
                  <Button type="button" onClick={handleAddSubKomisi} variant="outline" size="sm" className="bg-slate-50">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Komisi / Divisi
                  </Button>
                </div>

                <div className="space-y-6">
                  {subKomisi.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 mr-4">
                          <Label className="text-sm font-bold text-slate-700">Nama Komisi / Divisi</Label>
                          <Input className="mt-1" placeholder="Contoh: Komisi Fatwa, Divisi Humas..." value={sub.name} onChange={e => updateSubKomisiName(sIdx, e.target.value)} />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveSubKomisi(sIdx)} className="h-10 w-10 mt-6" title="Hapus komisi/divisi">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="ml-4 pl-4 border-l-2 border-slate-300">
                        <div className="flex justify-between items-center mb-3">
                          <Label className="text-sm font-semibold text-slate-600">Anggota Komisi / Divisi</Label>
                          <Button type="button" onClick={() => handleAddSubKomisiMember(sIdx)} variant="outline" size="sm" className="bg-white h-8 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Anggota
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {sub.members.map((member, mIdx) => (
                            <div key={mIdx} className="flex gap-3 items-end bg-white p-3 rounded border border-slate-200">
                              <div className="flex-1 space-y-1">
                                <Label className="text-[11px] text-slate-500">Nama Lengkap</Label>
                                <Input className="h-8 text-sm" placeholder="Nama..." value={member.nama} onChange={e => updateSubKomisiMember(sIdx, mIdx, 'nama', e.target.value)} />
                              </div>
                              <div className="flex-1 space-y-1">
                                <Label className="text-[11px] text-slate-500">Jabatan</Label>
                                <Input className="h-8 text-sm" placeholder="Jabatan..." value={member.jabatan} onChange={e => updateSubKomisiMember(sIdx, mIdx, 'jabatan', e.target.value)} />
                              </div>
                              <div className="flex-1 space-y-1">
                                <Label className="text-[11px] text-slate-500">No HP</Label>
                                <Input className="h-8 text-sm" placeholder="No HP..." value={member.no_hp} onChange={e => updateSubKomisiMember(sIdx, mIdx, 'no_hp', e.target.value)} />
                              </div>
                              <Button type="button" variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveSubKomisiMember(sIdx, mIdx)} title="Hapus anggota">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan Data</Button>
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
            <p className="text-center text-slate-500 mb-6 text-sm">Data anggota telah berhasil dimuat dari file Excel.</p>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 mb-6 border border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Anggota Bidang</span>
                <span className="font-bold text-slate-700">{importStats.bidang} Orang</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Anggota Komisi / Divisi</span>
                <span className="font-bold text-slate-700">{importStats.divisi} Orang</span>
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
