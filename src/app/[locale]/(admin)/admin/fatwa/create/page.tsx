"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function CreateFatwaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    no: '',
    date: '',
    type: 'MUI Pusat',
    status: 'Published'
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('no', form.no);
      formData.append('date', form.date);
      formData.append('type', form.type);
      formData.append('status', form.status);
      
      if (file) {
        formData.append('file_pdf', file);
      }

      const res = await axios.post('/api/fatwa', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Fatwa berhasil ditambahkan!');
        router.push('/admin/fatwa');
      } else {
        setError(res.data.error || 'Gagal menambahkan fatwa');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan pada server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/fatwa">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Fatwa Baru</h1>
          <p className="text-slate-500 mt-1">Unggah dokumen fatwa atau pedoman MUI baru ke dalam sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Fatwa</CardTitle>
          <CardDescription>Pastikan seluruh data dan file dokumen PDF telah benar sebelum disimpan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="font-bold">Judul Fatwa/Dokumen *</Label>
                <Input 
                  id="title" 
                  placeholder="Contoh: Ketentuan Hukum Qurban..." 
                  required 
                  value={form.title} 
                  onChange={(e) => setForm({...form, title: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no" className="font-bold">Nomor Fatwa *</Label>
                <Input 
                  id="no" 
                  placeholder="Contoh: Nomor 12 Tahun 2024" 
                  required 
                  value={form.no} 
                  onChange={(e) => setForm({...form, no: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="font-bold">Tanggal Rilis *</Label>
                <Input 
                  id="date" 
                  type="date"
                  required 
                  value={form.date} 
                  onChange={(e) => setForm({...form, date: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="font-bold">Tipe Penerbit *</Label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  <option value="MUI Pusat">MUI Pusat</option>
                  <option value="MUI DKI Jakarta">MUI DKI Jakarta</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold">Status Publikasi *</Label>
                <select 
                  id="status"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                >
                  <option value="Published">Publikasikan Langsung (Published)</option>
                  <option value="Draft">Simpan Sebagai Draft</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="file_pdf" className="font-bold flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" /> Unggah File PDF (Opsional)
                </Label>
                <Input 
                  id="file_pdf" 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
                <p className="text-xs text-slate-500">Maksimal ukuran file disarankan di bawah 5MB.</p>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Fatwa Baru</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
