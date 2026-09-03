"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, ExternalLink, Loader2, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type Slot = { id: string; title: string; description: string; image: string; link: string; alt: string; enabled: string };
const initialSlots: Slot[] = [
  { id: 'home', title: 'Banner Home', description: 'Tampil di bawah Jadwal Sholat pada halaman utama.', image: 'home_banner_image', link: 'home_banner_link', alt: 'home_banner_alt', enabled: 'home_banner_enabled' },
  { id: 'bottom', title: 'Banner Bawah Home', description: 'Tampil di halaman utama sebelum footer.', image: 'bottom_banner_image', link: 'bottom_banner_link', alt: 'bottom_banner_alt', enabled: 'bottom_banner_enabled' },
  { id: 'sidebar', title: 'Banner Sidebar Kanan', description: 'Tampil di sidebar kanan halaman internal dan detail berita.', image: 'sidebar_banner_image', link: 'sidebar_banner_link', alt: 'sidebar_banner_alt', enabled: 'sidebar_banner_enabled' },
  { id: 'below_news', title: 'Banner di Bawah Berita', description: 'Tampil setelah isi/detail berita.', image: 'below_news_banner_image', link: 'below_news_banner_link', alt: 'below_news_banner_alt', enabled: 'below_news_banner_enabled' },
];

export default function BannerManagementPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      if (res.data.success) setSettings(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));
  const upload = async (slot: Slot, file?: File) => {
    if (!file) return;
    const form = new FormData();
    form.append(slot.image, file);
    setSaving(slot.id);
    try {
      const res = await axios.post('/api/settings', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) update(slot.image, res.data.data?.[slot.image] || res.data.path || '');
      const fresh = await axios.get('/api/settings');
      if (fresh.data.success) setSettings(fresh.data.data);
    } catch (error) {
      alert(axios.isAxiosError(error) ? (error.response?.data?.error || 'Gagal mengunggah banner') : 'Gagal mengunggah banner');
    } finally {
      setSaving(null);
    }
  };
  const save = async (slot: Slot) => {
    setSaving(slot.id);
    try {
      await axios.post('/api/settings', {
        [slot.link]: settings[slot.link] || '',
        [slot.alt]: settings[slot.alt] || '',
        [slot.enabled]: settings[slot.enabled] === '0' ? '0' : '1',
      });
      alert(`${slot.title} berhasil disimpan.`);
    } catch (error) {
      alert('Gagal menyimpan pengaturan banner.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black text-slate-800">Banner</h1><p className="text-slate-500 mt-1">Kelola gambar banner berdasarkan posisi tampil di website.</p></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {initialSlots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5 text-emerald-600" />{slot.title}</CardTitle><CardDescription>{slot.description}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-[5/1] overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="absolute inset-0 z-10 opacity-0 cursor-pointer" onChange={(e) => upload(slot, e.target.files?.[0])} disabled={saving === slot.id} />
                {settings[slot.image] ? <img src={settings[slot.image]} alt={settings[slot.alt] || slot.title} className="w-full h-full object-cover" /> : <div className="text-center text-slate-500"><Upload className="w-8 h-8 mx-auto mb-2 text-emerald-500" /><span className="text-sm font-bold">Klik untuk unggah gambar</span></div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Tautan (opsional)</Label><Input value={settings[slot.link] || ''} onChange={(e) => update(slot.link, e.target.value)} placeholder="https://..." /></div>
                <div><Label>Teks alternatif</Label><Input value={settings[slot.alt] || ''} onChange={(e) => update(slot.alt, e.target.value)} placeholder="Deskripsi banner" /></div>
              </div>
              <div className="flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" className="w-4 h-4 accent-emerald-600" checked={settings[slot.enabled] !== '0'} onChange={(e) => update(slot.enabled, e.target.checked ? '1' : '0')} /> Tampilkan banner</label><Button type="button" onClick={() => save(slot)} disabled={saving === slot.id} className="bg-[#0F5132] hover:bg-[#167046]"><Save className="w-4 h-4 mr-2" />{saving === slot.id ? 'Menyimpan...' : 'Simpan'}</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-slate-500 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Format JPG, PNG, GIF, WebP; maksimal 10 MB per gambar.</p>
    </div>
  );
}

