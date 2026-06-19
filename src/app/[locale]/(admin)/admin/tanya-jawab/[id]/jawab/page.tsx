"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function TanyaJawabFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    ulama_penjawab: '',
    jawaban: '',
    video_url: '',
    ulama_photo: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, ulama_photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/api/tanya-jawab/${id}`);
        if (res.data.success) {
          setQuestion(res.data.data);
          setForm({
            ulama_penjawab: res.data.data.ulama_penjawab || '',
            jawaban: res.data.data.jawaban || '',
            video_url: res.data.data.video_url || '',
            ulama_photo: res.data.data.ulama_photo || ''
          });
        }
      } catch (err) {
        setError('Gagal memuat data pertanyaan');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuestion();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('ulama_penjawab', form.ulama_penjawab);
      formData.append('jawaban', form.jawaban);
      formData.append('video_url', form.video_url);
      
      const fileInput = document.getElementById('ulama_photo') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('ulama_photo_file', fileInput.files[0]);
      } else if (form.ulama_photo) {
        // If there's an existing photo URL
        formData.append('ulama_photo_existing', form.ulama_photo);
      }

      const res = await axios.put(`/api/tanya-jawab/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        alert('Jawaban berhasil disimpan!');
        router.push('/admin/tanya-jawab');
      } else {
        setError(res.data.error || 'Gagal menyimpan jawaban');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan pada server. Pastikan ukuran gambar tidak terlalu besar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  if (!question) {
    return <div className="text-center py-12 text-red-500">{error || 'Data tidak ditemukan'}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/tanya-jawab">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tanggapi Pertanyaan</h1>
          <p className="text-slate-500 mt-1">Berikan jawaban langsung dari dewan fatwa/ulama MUI DKI Jakarta.</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="bg-slate-50/50 pb-4">
          <CardTitle className="text-lg">Informasi Penanya</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 font-medium">Nama Lengkap</p>
            <p className="font-bold text-slate-800">{question.nama_lengkap}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Nomor Handphone</p>
            <p className="font-bold text-slate-800">{question.no_hp || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Email</p>
            <p className="font-bold text-slate-800">{question.email || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Asal Daerah</p>
            <p className="font-bold text-slate-800">{question.kota ? `${question.kota}, ${question.provinsi}` : '-'}</p>
          </div>
          <div className="md:col-span-2 mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-slate-500 font-bold mb-2">Isi Pertanyaan:</p>
            <p className="text-slate-800 italic leading-relaxed">"{question.pertanyaan}"</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Jawaban Ulama</CardTitle>
          <CardDescription>Lengkapi isian di bawah ini untuk merilis jawaban secara publik (jika disetujui).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ulama_penjawab" className="font-bold">Nama Ulama yang Menjawab *</Label>
                <Input 
                  id="ulama_penjawab" 
                  placeholder="Masukkan nama ulama penjawab" 
                  required 
                  value={form.ulama_penjawab} 
                  onChange={(e) => setForm({...form, ulama_penjawab: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ulama_photo" className="font-bold">Foto Profil Ulama (Opsional)</Label>
                <div className="flex items-center gap-4">
                  {form.ulama_photo && (
                    <img src={form.ulama_photo} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  )}
                  <Input 
                    id="ulama_photo" 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jawaban" className="font-bold">Isi Jawaban *</Label>
              <textarea 
                id="jawaban" 
                rows={10} 
                className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                placeholder="Ketikkan dalil dan rincian jawaban di sini..."
                required
                value={form.jawaban}
                onChange={(e) => setForm({...form, jawaban: e.target.value})}
              ></textarea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url" className="font-bold flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-red-500" /> Link Video Youtube Jawaban (Opsional)
              </Label>
              <Input 
                id="video_url" 
                placeholder="https://youtube.com/watch?v=..." 
                value={form.video_url} 
                onChange={(e) => setForm({...form, video_url: e.target.value})} 
              />
              <p className="text-xs text-slate-500">Kosongkan jika tidak ada referensi video untuk jawaban ini.</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Jawaban</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
