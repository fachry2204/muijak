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

  const [leaders, setLeaders] = useState<any[]>([]);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderForm, setLeaderForm] = useState({ name: '', position_id: '', image_url: '' });
  const [leaderFile, setLeaderFile] = useState<File | null>(null);

  const fetchLeaders = async () => {
    try {
      const res = await axios.get('/api/leaders');
      if (res.data.success) {
        setLeaders(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load leaders');
    }
  };

  useEffect(() => {
    fetchLeaders();
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

  const handleOpenLeaderModal = (leader: any = null) => {
    if (leader) {
      setEditingLeaderId(leader.id);
      setLeaderForm({ name: leader.name, position_id: leader.position_id, image_url: leader.image_url || '' });
    } else {
      setEditingLeaderId(null);
      setLeaderForm({ name: '', position_id: '', image_url: '' });
    }
    setLeaderFile(null);
    setShowLeaderModal(true);
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', leaderForm.name);
      formData.append('position_id', leaderForm.position_id);
      if (leaderFile) {
        formData.append('image', leaderFile);
      } else if (leaderForm.image_url) {
        formData.append('image_url', leaderForm.image_url);
      }
      
      if (editingLeaderId) {
        await axios.put(`/api/leaders/${editingLeaderId}`, formData);
        alert('Pimpinan berhasil diperbarui!');
      } else {
        await axios.post('/api/leaders', formData);
        alert('Pimpinan berhasil ditambahkan!');
      }
      setShowLeaderModal(false);
      fetchLeaders();
    } catch (error) {
      alert('Gagal menyimpan data pimpinan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLeader = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pimpinan ini?')) {
      try {
        await axios.delete(`/api/leaders/${id}`);
        alert('Pimpinan berhasil dihapus!');
        fetchLeaders();
      } catch (error) {
        alert('Gagal menghapus data pimpinan');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Profil & Organisasi</h1>
          <p className="text-slate-500 mt-1">Kelola sejarah, visi misi, dan data pimpinan inti MUI DKI Jakarta.</p>
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
                  <Button onClick={() => handleOpenLeaderModal()} className="bg-[#0F5132] hover:bg-[#167046]">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Pimpinan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {leaders.map((person, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                          {person.image_url ? (
                            <img src={person.image_url} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <UserCheck className="w-16 h-16 text-slate-300" />
                          )}
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenLeaderModal(person)} className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteLeader(person.id)} className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5 text-center">
                          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{person.name}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{person.position_id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {leaders.length === 0 && (
                     <div className="text-center py-8 text-slate-500">Belum ada data pimpinan.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>

      {showLeaderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-800">{editingLeaderId ? 'Edit Data Pimpinan' : 'Tambah Pimpinan'}</h2>
            </div>
            <form onSubmit={handleSaveLeader}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    value={leaderForm.name} 
                    onChange={e => setLeaderForm({...leaderForm, name: e.target.value})} 
                    placeholder="Contoh: KH. Anwar Iskandar" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jabatan</Label>
                  <Input 
                    value={leaderForm.position_id} 
                    onChange={e => setLeaderForm({...leaderForm, position_id: e.target.value})} 
                    placeholder="Contoh: Ketua Umum" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Foto Pimpinan (Opsional)</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setLeaderFile(e.target.files ? e.target.files[0] : null)} 
                  />
                  {!leaderFile && leaderForm.image_url && (
                    <p className="text-xs text-slate-500 mt-1">Foto saat ini terpasang.</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowLeaderModal(false)}>Batal</Button>
                <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
