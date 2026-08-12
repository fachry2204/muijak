"use client";

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Share2, Globe, MessageCircle, Link as LinkIcon, ChevronRight, Calendar, User, Eye, Tag } from 'lucide-react';

export default function ReadNewsPage() {
  const params = useParams();
  
  // Dummy data based on the requested design
  const article = {
    title: "MUI DKI Jakarta Lulus Resertifikasi ISO 9001:2015, Tegaskan Komitmen Pelayanan",
    category: "Infokom",
    author: "Tim Redaksi",
    date: "17 Juni 2026",
    views: "1.2K",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p><strong>JAKARTA, MUI.OR.ID</strong> - Majelis Ulama Indonesia (MUI) Provinsi DKI Jakarta kembali mencatatkan prestasi membanggakan dengan berhasil meraih kelulusan dalam Resertifikasi Sistem Manajemen Mutu ISO 9001:2015. Capaian ini menegaskan komitmen kuat lembaga dalam menghadirkan pelayanan publik yang profesional, transparan, dan akuntabel bagi umat Islam di ibu kota.</p>
      
      <h2>Komitmen Pelayanan Unggul</h2>
      <p>Proses audit resertifikasi yang berlangsung secara komprehensif ini menilai berbagai aspek operasional dan manajerial di lingkungan MUI DKI Jakarta. Tim auditor independen menyoroti keberhasilan lembaga dalam mempertahankan standar mutu pelayanan, mulai dari layanan fatwa, sertifikasi halal, hingga program pendidikan kader ulama (PKU).</p>
      
      <p>"Alhamdulillah, keberhasilan resertifikasi ISO 9001:2015 ini adalah bukti nyata bahwa MUI DKI Jakarta terus berbenah dan mengedepankan profesionalisme dalam melayani umat. Standar ini bukan sekadar sertifikat di atas kertas, melainkan panduan kerja yang kami implementasikan sehari-hari," ujar Ketua Umum MUI DKI Jakarta dalam keterangannya.</p>
      
      <blockquote>
        "Standar mutu ISO 9001:2015 memastikan bahwa setiap prosedur yang kami jalankan memiliki indikator capaian yang jelas dan berorientasi pada kepuasan masyarakat."
      </blockquote>

      <h2>Langkah Strategis ke Depan</h2>
      <p>Keberhasilan ini juga sejalan dengan visi MUI DKI Jakarta untuk menjadi tenda besar umat Islam yang responsif terhadap dinamika zaman. Dengan sistem manajemen mutu yang terstandarisasi, proses administrasi dan pengambilan keputusan strategis diharapkan dapat berjalan lebih cepat dan akurat.</p>
      
      <ul>
        <li>Peningkatan kapasitas Sumber Daya Manusia (SDM) di lingkungan sekretariat.</li>
        <li>Digitalisasi layanan publik berbasis teknologi informasi terintegrasi.</li>
        <li>Penguatan pengawasan internal untuk memastikan <em>continuous improvement</em>.</li>
      </ul>
      
      <p>MUI DKI Jakarta mengajak seluruh komponen umat Islam dan masyarakat luas untuk terus mendukung berbagai program kebaikan yang sedang berjalan. Dengan sinergi yang kuat, MUI berkomitmen untuk menghadirkan solusi atas berbagai problematika keumatan dan kebangsaan di Jakarta.</p>
    `,
    tags: ["ISO 9001:2015", "MUI Jakarta", "Pelayanan Publik", "Sertifikasi"]
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1000px] mx-auto px-4 flex items-center text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-600">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/news" className="hover:text-emerald-600">Berita</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="#" className="hover:text-emerald-600">{article.category}</Link>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 pt-10 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="lg:w-[70%]">
          
          {/* Article Header */}
          <div className="mb-8">
            <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 uppercase tracking-wider rounded">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-200 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-700">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>{article.views} Kali Dibaca</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8 shadow-md">
            <img src={article.image} alt={article.title} className="w-full h-auto object-cover aspect-video" />
            <div className="bg-slate-100 p-3 text-xs text-slate-500 text-center italic">
              Ilustrasi: Pengurus MUI DKI Jakarta dalam rapat koordinasi. (Foto: Dok. MUI)
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-bold text-slate-700">Bagikan:</span>
            <button className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <Globe className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Rich Text Content */}
          <article className="prose prose-lg max-w-none prose-emerald prose-headings:font-bold prose-a:text-blue-600 mb-10 leading-7 [&_p]:!text-justify [&_p]:mb-5 [&_p:last-child]:mb-0 [&_p:empty]:min-h-[1.25rem]">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 mb-12">
            <Tag className="w-5 h-5 text-slate-400 mr-2" />
            {article.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-xs font-bold px-3 py-1 rounded cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Related News */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold border-l-4 border-emerald-600 pl-3 mb-6">Berita Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="rounded-lg overflow-hidden mb-3 aspect-[4/3]">
                    <img src={`https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                    Soroti Isu Lingkungan, Bencana, Pendidikan, Museum Rasulullah dan Hak Warga
                  </h4>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="lg:w-[30%]">
          
          <div className="sticky top-24 space-y-8">
            {/* Trending */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-3 mb-4 uppercase">Terpopuler</h3>
              <div className="space-y-4">
                {[1,2,3,4,5].map((item) => (
                  <div key={item} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-3 last:border-0">
                    <div className="text-2xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">0{item}</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-emerald-600 transition-colors">
                        HIDUPKAN TRADISI TALAQQI, MUI DKI JAKARTA DAN UMJ GELAR DAUROH HADIS
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Ad */}
            <div className="bg-slate-200 h-[250px] rounded-xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-sm border border-slate-300">
              Banner Iklan
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
