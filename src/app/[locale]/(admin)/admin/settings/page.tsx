"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Map, Share2, Globe, MessageCircle, Camera, Tv, Monitor, Users, ShieldAlert, KeyRound, Plus, Upload, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

export default function SettingsManagementPage() {
  const [activeTab, setActiveTab] = useState('website');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);

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
      console.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('website_logo', file);
      
      setIsSaving(true);
      try {
        const res = await axios.post('/api/settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          alert('Logo berhasil diunggah dan disimpan!');
          fetchData(); // Refresh to get the new logo URL
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

        {/* General Info & Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" /> Identitas Website
              </CardTitle>
              <CardDescription>Logo utama yang akan digunakan pada header dan favicon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {settings.website_logo ? (
                  <img src={settings.website_logo} alt="Logo" className="max-h-24 object-contain mb-3" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-indigo-500" />
                  </div>
                )}
                <p className="text-sm font-bold text-slate-700">Pilih atau letakkan gambar logo</p>
                <p className="text-xs text-slate-500 mt-1">Format PNG, JPG, atau WebP (Max. 2MB)</p>
              </div>
            </CardContent>
          </Card>

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
        </div>

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
            
            <div className="space-y-2">
              <Label>Lokasi Peta (Berdasarkan Alamat)</Label>
              <p className="text-xs text-slate-500">Peta akan otomatis menampilkan lokasi berdasarkan isian "Alamat Lengkap" di atas.</p>
            </div>
            <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mt-2">
               {settings.address ? (
                 <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400">Silakan isi alamat untuk melihat peta</div>
               )}
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen User Admin</CardTitle>
              <CardDescription>Tambah, edit, atau hapus akun administrator yang dapat login ke panel ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p>Modul Manajemen User akan ditampilkan di sini.</p>
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
                  <Button size="sm" className="bg-[#0F5132] hover:bg-[#167046]"><Plus className="w-4 h-4 mr-1" /> Tambah Role</Button>
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
                  <Button onClick={handleSavePermissions} disabled={isSavingRole} className="bg-amber-500 hover:bg-amber-600 px-8">
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Keamanan</CardTitle>
              <CardDescription>Kelola session timeout, aktivitas login, dan konfigurasi keamanan sistem.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p>Konfigurasi Keamanan (Security) akan ditampilkan di sini.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
