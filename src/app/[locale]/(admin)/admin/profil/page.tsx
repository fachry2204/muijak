"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Save, Plus, Users, LayoutTemplate, UserCheck, Edit, Trash2 } from 'lucide-react';

export default function ProfilManagementPage() {
  const [activeTab, setActiveTab] = useState('profil_umum');
  const [sejarah, setSejarah] = useState('');
  const [visi, setVisi] = useState('');
  const [misiList, setMisiList] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          const { sejarah, visi, misi } = res.data.data;
          if (sejarah) setSejarah(sejarah);
          if (visi) setVisi(visi);
          if (misi) {
            try {
              setMisiList(JSON.parse(misi));
            } catch (e) {
              setMisiList(['']);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load profil settings');
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSejarah = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/settings', { sejarah });
      alert('Sejarah berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan sejarah');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVisiMisi = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/settings', { 
        visi, 
        misi: JSON.stringify(misiList.filter(m => m.trim() !== '')) 
      });
      alert('Visi & Misi berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan Visi & Misi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMisi = () => setMisiList([...misiList, '']);
  const handleMisiChange = (index: number, value: string) => {
    const newMisi = [...misiList];
    newMisi[index] = value;
    setMisiList(newMisi);
  };
  const handleRemoveMisi = (index: number) => {
    const newMisi = misiList.filter((_, i) => i !== index);
    setMisiList(newMisi);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Profil & Organisasi</h1>
          <p className="text-slate-500 mt-1">Kelola sejarah, visi misi, data pimpinan, dan direktori anggota MUI DKI Jakarta.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-row flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab('profil_umum')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'profil_umum' ? 'bg-[#0F5132] text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
          >
            <LayoutTemplate className="w-5 h-5" /> Profil Umum
          </button>
          <button 
            onClick={() => setActiveTab('pimpinan')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'pimpinan' ? 'bg-[#0F5132] text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
          >
            <UserCheck className="w-5 h-5" /> Data Pimpinan
          </button>
          <button 
            onClick={() => setActiveTab('anggota')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'anggota' ? 'bg-[#0F5132] text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
          >
            <Users className="w-5 h-5" /> Direktori Anggota
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* TAB: Profil Umum */}
          {activeTab === 'profil_umum' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Sejarah MUI DKI Jakarta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichTextEditor content={sejarah} onChange={setSejarah} />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveSejarah} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 mr-2" /> Simpan Sejarah
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visi & Misi</CardTitle>
                  <CardDescription>Kelola Visi dan daftar Misi organisasi secara terpisah.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-slate-800">Visi Utama</Label>
                    <textarea 
                      className="w-full border border-slate-200 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Masukkan visi organisasi..."
                      value={visi}
                      onChange={(e) => setVisi(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold text-slate-800">Daftar Misi</Label>
                    </div>
                    {misiList.map((misi, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="mt-2 text-emerald-700 font-bold bg-emerald-100 w-8 h-8 flex items-center justify-center rounded-full shrink-0">{idx + 1}</div>
                        <textarea 
                          className="flex-1 border border-slate-200 rounded-md p-3 min-h-[80px] focus:ring-2 focus:ring-emerald-500 outline-none"
                          placeholder={`Tuliskan misi ke-${idx + 1}...`}
                          value={misi}
                          onChange={(e) => handleMisiChange(idx, e.target.value)}
                        ></textarea>
                        {misiList.length > 1 && (
                          <Button type="button" onClick={() => handleRemoveMisi(idx)} variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0 mt-1 h-10 w-10 p-0 rounded-full border-red-100">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button type="button" onClick={handleAddMisi} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full border-dashed py-6">
                      <Plus className="w-4 h-4 mr-2" /> Tambahkan Misi Lainnya
                    </Button>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveVisiMisi} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 mr-2" /> Simpan Visi & Misi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: Data Pimpinan */}
          {activeTab === 'pimpinan' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Daftar Pimpinan</CardTitle>
                    <CardDescription>Ketua Umum, Wakil Ketua, dan Pengurus Inti</CardDescription>
                  </div>
                  <Button className="bg-[#0F5132] hover:bg-[#167046]">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Pimpinan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      { name: 'KH. Anwar Iskandar', role: 'Ketua Umum', img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop' },
                      { name: 'Buya Amirsyah Tambunan', role: 'Sekretaris Umum', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop' },
                      { name: 'KH. Marsudi Syuhud', role: 'Wakil Ketua Umum', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop' },
                    ].map((person, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                          <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5 text-center">
                          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{person.name}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{person.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: Direktori Anggota */}
          {activeTab === 'anggota' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Direktori Anggota MUI Kota</CardTitle>
                    <CardDescription>Data seluruh anggota MUI di wilayah DKI Jakarta</CardDescription>
                  </div>
                  <Button className="bg-[#0F5132] hover:bg-[#167046]">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Anggota
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Cari nama anggota..." className="max-w-sm" />
                    <select className="border rounded-md px-3 bg-white">
                      <option>Semua Wilayah</option>
                      <option>Jakarta Pusat</option>
                      <option>Jakarta Selatan</option>
                      <option>Jakarta Timur</option>
                    </select>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3">Wilayah</th>
                          <th className="px-4 py-3">Status Verifikasi</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-500">
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center">Belum ada data anggota.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
