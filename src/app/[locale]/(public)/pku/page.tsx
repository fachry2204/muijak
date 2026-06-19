"use client";

import { Link } from '@/i18n/routing';
import { ChevronRight, Award, BookOpen, GraduationCap, Download, ArrowRight, BookMarked, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PKUPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#1a1a1a]/80 py-20 relative overflow-hidden bg-[url('/gambar/bread.jpg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Beasiswa & Riset</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Pusat Kajian Umat<br/>(PKU) MUI DKI</h1>
            <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
              Inkubator cendekiawan muslim masa depan. Menyediakan program beasiswa S-2/S-3, kajian akademis, serta penelitian tematik untuk merespons dinamika keumatan di ibukota.
            </p>
            <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30">
                Pendaftaran PKU 2026
              </button>
            </div>
          </div>
          <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center">
             <div className="w-64 h-64 bg-purple-900/40 rounded-full flex items-center justify-center border-4 border-purple-500/30 backdrop-blur-md">
                <GraduationCap className="w-32 h-32 text-purple-300" />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-16">
            
            {/* Profil Singkat PKU */}
            <section className="prose prose-lg prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-purple-600 pb-3 inline-block">Tentang PKU</h2>
              <p>
                Program Pendidikan Kader Ulama (PKU) MUI Provinsi DKI Jakarta didirikan sebagai respons strategis atas kebutuhan mendesak akan hadirnya ulama dan cendekiawan muslim yang memiliki kapasitas keilmuan yang mendalam (Tafaqquh Fiddin) sekaligus wawasan kebangsaan yang luas.
              </p>
              <p>
                PKU memfasilitasi mahasiswa pascasarjana terpilih melalui beasiswa penuh, bekerja sama dengan Perguruan Tinggi terkemuka di Indonesia dan Timur Tengah (seperti Universitas Al-Azhar Kairo).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                 <Card className="bg-purple-50 border-purple-100">
                   <CardContent className="pt-6 flex items-start gap-4">
                     <Award className="w-10 h-10 text-purple-600 shrink-0" />
                     <div>
                       <h4 className="font-bold text-slate-800 text-lg">Beasiswa Penuh</h4>
                       <p className="text-sm text-slate-600 mt-1">Dukungan finansial SPP hingga living cost selama studi berlangsung.</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="bg-purple-50 border-purple-100">
                   <CardContent className="pt-6 flex items-start gap-4">
                     <BookOpen className="w-10 h-10 text-purple-600 shrink-0" />
                     <div>
                       <h4 className="font-bold text-slate-800 text-lg">Dauroh Tambahan</h4>
                       <p className="text-sm text-slate-600 mt-1">Mendapatkan kuliah intensif dari tokoh nasional dan pakar MUI pusat/daerah.</p>
                     </div>
                   </CardContent>
                 </Card>
              </div>
            </section>

            {/* Artikel & Kajian */}
            <section>
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                  <BookMarked className="w-8 h-8 text-purple-600" /> Jurnal & Kajian Akademis
                </h2>
                <Link href="#" className="text-purple-600 font-bold hover:underline">Indeks Kajian</Link>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Kajian Kritis terhadap Fenomena Pinjaman Online dalam Perspektif Maqashid Syariah", type: "Penelitian", author: "Dr. H. Ahmad Fathoni" },
                  { title: "Harmonisasi Beragama di Jakarta: Evaluasi Kinerja FKUB dan Peran MUI", type: "Kajian", author: "Tim Riset PKU" },
                  { title: "Tinjauan Hukum Islam terhadap Rekayasa Genetika pada Tanaman Pangan", type: "Artikel Ilmiah", author: "M. Naufal, Lc., MA" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 transition-all hover:shadow-md">
                     <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center shrink-0">
                       <Layers className="w-6 h-6" />
                     </div>
                     <div>
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 inline-block">{item.type}</span>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-purple-700 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500">Oleh: {item.author}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="lg:col-span-4">
            
            {/* Download Documents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg sticky top-24">
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Download Dokumen</h3>
               <p className="text-slate-500 text-sm mb-6">Berkas panduan pendaftaran PKU, silabus, dan buku panduan tesis.</p>
               
               <div className="space-y-4">
                 {[
                   { name: "Buku Pedoman PKU 2026.pdf", size: "3.5 MB" },
                   { name: "Form Pendaftaran Beasiswa.docx", size: "450 KB" },
                   { name: "Silabus Dauroh Intensif.pdf", size: "1.1 MB" },
                   { name: "Format Penulisan Tesis.pdf", size: "800 KB" }
                 ].map((file, idx) => (
                   <div key={idx} className="flex items-center justify-between border border-slate-100 p-4 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.size}</p>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                 <p className="text-sm text-slate-500 mb-4">Butuh bantuan pendaftaran?</p>
                 <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors">
                   Hubungi Admin PKU
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
