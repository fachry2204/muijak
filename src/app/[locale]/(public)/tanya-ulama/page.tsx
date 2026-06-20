"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, HelpCircle, Loader2, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function TanyaUlamaPage() {
  const [form, setForm] = useState({
    nama_lengkap: '',
    no_hp: '',
    email: '',
    provinsi: '',
    kota: '',
    pertanyaan: ''
  });

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
      answer: ''
    });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) {
      setError('Jawaban matematika salah. Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    if (!form.nama_lengkap || !form.pertanyaan) {
      setError('Nama Lengkap dan Pertanyaan wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/tanya-ulama', form);
      if (res.data.success) {
        setSuccess(true);
        setForm({ nama_lengkap: '', no_hp: '', email: '', provinsi: '', kota: '', pertanyaan: '' });
      } else {
        setError(res.data.error || 'Gagal mengirim pertanyaan.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page Header — sama persis dengan halaman Berita */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat"
             style={{ backgroundSize: '200px' }}>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-emerald-200/70 mb-5">
            <Link href="/" className="hover:text-amber-300 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-amber-300 font-semibold">Tanya Ulama</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-emerald-300 mb-4 uppercase tracking-tight">Tanya Ulama Jakarta</h1>
          <p className="text-emerald-100/90 text-lg max-w-2xl mx-auto">
            Sampaikan pertanyaan Anda seputar agama Islam kepada para ulama dan tim fatwa Majelis Ulama Indonesia Provinsi DKI Jakarta.
          </p>
        </div>
      </div>

      {/* ── Form Section ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-3xl py-12">

        <Card className="border-t-4 border-t-amber-500 shadow-lg">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
            <CardTitle className="text-xl text-slate-800">Formulir Pertanyaan</CardTitle>
            <CardDescription>Semua kolom dengan tanda bintang (*) wajib diisi.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Pertanyaan Berhasil Dikirim!</h3>
                <p className="text-slate-600 mb-6">
                  Terima kasih telah bertanya. Pertanyaan Anda akan segera diproses dan dijawab oleh tim fatwa/ulama kami.
                </p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Kirim Pertanyaan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama_lengkap" className="font-bold">Nama Lengkap *</Label>
                    <Input id="nama_lengkap" placeholder="Masukkan nama lengkap" required value={form.nama_lengkap} onChange={handleChange} className="focus-visible:ring-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no_hp" className="font-bold">Nomor Handphone</Label>
                    <Input id="no_hp" type="tel" placeholder="Contoh: 0812..." value={form.no_hp} onChange={handleChange} className="focus-visible:ring-amber-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email</Label>
                  <Input id="email" type="email" placeholder="Alamat email aktif" value={form.email} onChange={handleChange} className="focus-visible:ring-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="provinsi" className="font-bold">Asal Provinsi</Label>
                    <Input id="provinsi" placeholder="Contoh: DKI Jakarta" value={form.provinsi} onChange={handleChange} className="focus-visible:ring-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kota" className="font-bold">Asal Kota / Kabupaten</Label>
                    <Input id="kota" placeholder="Contoh: Jakarta Selatan" value={form.kota} onChange={handleChange} className="focus-visible:ring-amber-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pertanyaan" className="font-bold">Pertanyaan Untuk MUI DKI Jakarta *</Label>
                  <textarea 
                    id="pertanyaan" 
                    rows={5} 
                    className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tuliskan pertanyaan Anda secara jelas dan ringkas..."
                    required
                    value={form.pertanyaan}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col items-start gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Verifikasi Keamanan (Anti-Spam) *</p>
                    <p className="text-xs text-slate-500 mb-2">Berapa hasil dari <strong className="text-slate-800 text-sm">{captcha.num1} + {captcha.num2}</strong> ?</p>
                  </div>
                  <Input 
                    required 
                    type="number" 
                    className="w-full sm:w-32 focus-visible:ring-amber-500 text-center font-bold" 
                    placeholder="Masukkan jawaban"
                    value={captcha.answer}
                    onChange={(e) => setCaptcha({...captcha, answer: e.target.value})}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 text-lg">
                  {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim...</> : <><Send className="w-5 h-5 mr-2" /> Kirim Pertanyaan</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
