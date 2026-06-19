"use client";

import { Link } from '@/i18n/routing';
import { ChevronRight, CheckCircle, Download, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HalalPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#0f5132]/90 py-20 relative overflow-hidden bg-[url('/gambar/bread.jpg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <span className="bg-[#d1a64b] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">LPPOM MUI</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Pusat Informasi<br/>Sertifikasi Halal</h1>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl">
              Layanan terpadu informasi regulasi, prosedur pengajuan, artikel edukasi, dan unduhan formulir untuk menjamin kehalalan produk Anda bersama MUI DKI Jakarta.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-[#0f5132] px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                Mulai Sertifikasi
              </button>
              <button className="border border-emerald-300 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                Cek Produk Halal
              </button>
            </div>
          </div>
          <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center">
             <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
                <CheckCircle className="w-32 h-32 text-[#d1a64b]" />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-16">
            
            {/* Proses Sertifikasi */}
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-emerald-600 pb-3 inline-block">Alur Sertifikasi Halal</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: '1. Pendaftaran', desc: 'Melengkapi dokumen legalitas dan mengisi form pendaftaran SIHALAL.' },
                   { title: '2. Audit Lapangan', desc: 'Tim auditor LPPOM akan memverifikasi bahan dan proses produksi di lokasi.' },
                   { title: '3. Sidang Fatwa', desc: 'Penetapan kehalalan produk melalui sidang Komisi Fatwa MUI.' }
                 ].map((step, i) => (
                   <Card key={i} className="border-t-4 border-t-[#0f5132] shadow-md hover:-translate-y-1 transition-transform">
                     <CardContent className="pt-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                     </CardContent>
                   </Card>
                 ))}
              </div>
            </section>

            {/* Artikel Halal */}
            <section>
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-8 h-8 text-[#d1a64b]" /> Artikel & Edukasi Halal
                </h2>
                <Link href="#" className="text-emerald-600 font-bold hover:underline">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
                    <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&q=80" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded uppercase mb-2 inline-block">Edukasi</span>
                      <h4 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">Pentingnya Memahami Titik Kritis Kehalalan Daging Potong</h4>
                      <p className="text-xs text-slate-400 mt-2">10 Juni 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                <HelpCircle className="w-8 h-8 text-[#d1a64b]" /> FAQ (Tanya Jawab)
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <Accordion className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-emerald-700">Berapa lama proses sertifikasi halal berlangsung?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      Waktu proses sertifikasi bergantung pada jenis produk dan kelengkapan dokumen. Umumnya memakan waktu 21 hari kerja sejak dokumen dinyatakan lengkap oleh BPJPH.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-emerald-700">Apakah UMKM mendapatkan subsidi biaya?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      Ya, program Sertifikasi Halal Gratis (SEHATI) tersedia untuk pelaku Usaha Mikro dan Kecil (UMK) yang memenuhi kriteria jalur Self Declare.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-emerald-700">Dokumen apa saja yang harus disiapkan di tahap awal?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      Persyaratan awal meliputi NIB (Nomor Induk Berusaha), data pelaku usaha, nama produk, daftar produk/bahan yang digunakan, serta proses pengolahan produk.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>

          </div>

          <div className="lg:col-span-4">
            
            {/* Download Area */}
            <div className="bg-[#0f5132] text-white rounded-2xl p-8 shadow-xl sticky top-24">
               <h3 className="text-2xl font-bold mb-2">Download Formulir</h3>
               <p className="text-emerald-100 text-sm mb-6">Unduh format dokumen resmi yang dibutuhkan untuk pengajuan sertifikasi.</p>
               
               <div className="space-y-4">
                 {[
                   { name: "Form Pendaftaran Baru.pdf", size: "1.2 MB" },
                   { name: "Matriks Bahan Produk.xlsx", size: "850 KB" },
                   { name: "Manual SJPH.docx", size: "2.1 MB" },
                   { name: "Surat Pernyataan.pdf", size: "400 KB" }
                 ].map((file, idx) => (
                   <div key={idx} className="flex items-center justify-between bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#d1a64b]" />
                        <div>
                          <p className="font-bold text-sm">{file.name}</p>
                          <p className="text-xs text-emerald-200">{file.size}</p>
                        </div>
                      </div>
                      <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                   </div>
                 ))}
               </div>
               
               <button className="w-full bg-[#d1a64b] hover:bg-white hover:text-[#0f5132] text-white font-bold py-3 rounded-lg mt-8 transition-colors flex items-center justify-center gap-2">
                 Unduh Semua Arsip <ArrowRight className="w-4 h-4" />
               </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
