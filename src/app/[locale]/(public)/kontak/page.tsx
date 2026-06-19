"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronRight, MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function KontakPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Anti-spam states
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [mathAnswer, setMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [mathError, setMathError] = useState(false);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot) {
      setSuccess(true); // Fake success for bots
      return;
    }
    
    // Math CAPTCHA check
    if (parseInt(mathAnswer) !== num1 + num2) {
      setMathError(true);
      return;
    }
    setMathError(false);

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form
      setMathAnswer('');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0b3c22]/90 py-16 relative overflow-hidden bg-[url('/gambar/bread.jpg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Hubungi Kami</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Layanan aspirasi, pengaduan, dan informasi Majelis Ulama Indonesia Provinsi DKI Jakarta. Kami siap membantu dan mendengar pesan Anda.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-600">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/kontak" className="text-emerald-700 font-bold">Kontak</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#d1a64b] rounded-full block"></span>
                Informasi Kontak
              </h2>
              <div className="space-y-6">
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Alamat Kantor</h4>
                    <p className="text-slate-600 leading-relaxed mt-1">
                      Jl. Cikini Raya No.73, RT.1/RW.2, Cikini, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10330
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Telepon</h4>
                    <p className="text-slate-600 mt-1">(021) 3141151</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Email</h4>
                    <p className="text-slate-600 mt-1">sekretariat@muijakarta.or.id</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Jam Operasional</h4>
                    <p className="text-slate-600 mt-1">Senin - Jumat: 08.00 - 16.00 WIB</p>
                    <p className="text-slate-500 text-sm">Sabtu, Minggu, dan Hari Libur Nasional tutup.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map Box */}
            <div className="w-full h-64 bg-slate-200 rounded-2xl overflow-hidden shadow-md border border-slate-200">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.529806497262!2d106.83610991535496!3d-6.193600995516086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305bc9e273%3A0xc367d3b24bb8d4cc!2sKantor%20MUI%20DKI%20Jakarta!5e0!3m2!1sen!2sid!4v1689254011234!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Kantor MUI DKI Jakarta"
              ></iframe>
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-emerald-50">
              <h2 className="text-2xl font-bold text-[#0b3c22] mb-2">Kirimkan Pesan</h2>
              <p className="text-slate-500 mb-8">Silakan isi formulir di bawah ini dengan data yang valid. Tim kami akan segera merespons pesan Anda.</p>
              
              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Pesan Berhasil Terkirim!</h3>
                  <p className="text-emerald-600 mb-6">Terima kasih telah menghubungi MUI DKI Jakarta. Kami akan merespons melalui email/telepon Anda secepatnya.</p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-slate-700 font-bold">Nama Lengkap <span className="text-red-500">*</span></Label>
                      <Input id="nama" required placeholder="Masukkan nama lengkap Anda" className="h-12 bg-slate-50 focus-visible:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-bold">Alamat Email <span className="text-red-500">*</span></Label>
                      <Input id="email" type="email" required placeholder="email@contoh.com" className="h-12 bg-slate-50 focus-visible:ring-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nohp" className="text-slate-700 font-bold">No. Handphone / WhatsApp <span className="text-red-500">*</span></Label>
                    <Input id="nohp" type="tel" required placeholder="Contoh: 081234567890" className="h-12 bg-slate-50 focus-visible:ring-emerald-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesan" className="text-slate-700 font-bold">Isi Pesan <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="pesan" 
                      required 
                      rows={6} 
                      placeholder="Tuliskan pertanyaan, aduan, atau pesan Anda secara detail..." 
                      className="bg-slate-50 focus-visible:ring-emerald-500 resize-none" 
                    />
                  </div>

                  {/* Honeypot Field */}
                  <div className="opacity-0 absolute top-0 left-0 -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website_url">Website URL</label>
                    <Input 
                      id="website_url" 
                      name="website_url" 
                      tabIndex={-1} 
                      autoComplete="off" 
                      value={honeypot} 
                      onChange={(e) => setHoneypot(e.target.value)} 
                    />
                  </div>

                  {/* Math CAPTCHA */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Label htmlFor="captcha" className="text-slate-700 font-bold flex items-center justify-between">
                      <span>Verifikasi Keamanan <span className="text-red-500">*</span></span>
                      <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Anti-Spam</span>
                    </Label>
                    <p className="text-sm text-slate-600 mb-2">Berapa hasil dari: <strong className="text-lg text-slate-800">{num1} + {num2} = ?</strong></p>
                    <Input 
                      id="captcha" 
                      type="number" 
                      required 
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      placeholder="Masukkan hasil penjumlahan" 
                      className={`h-12 bg-white focus-visible:ring-emerald-500 ${mathError ? 'border-red-500 ring-red-500 focus-visible:ring-red-500' : ''}`} 
                    />
                    {mathError && <p className="text-red-500 text-xs font-bold mt-1">Jawaban verifikasi salah. Silakan coba lagi.</p>}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 bg-[#105c36] hover:bg-[#0b3c22] text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center group">
                    {loading ? (
                      <span className="flex items-center gap-2">Memproses...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Kirim Pesan <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    Data yang Anda kirimkan dijamin kerahasiaannya sesuai dengan kebijakan privasi kami.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
