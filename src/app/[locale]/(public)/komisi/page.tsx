"use client";

import { CheckCircle, FileText, Users, ArrowRight } from 'lucide-react';

export default function KomisiPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#0f5132]/90 py-20 relative overflow-hidden bg-[url('/gambar/bread.jpg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <span className="bg-[#d1a64b] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">MUI DKI Jakarta</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Komisi & Badan<br/>Otonom</h1>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl">
              Mengenal lebih dekat struktur, tugas pokok, dan fungsi dari setiap komisi yang mengabdi di Majelis Ulama Indonesia Provinsi DKI Jakarta.
            </p>
          </div>
          <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center">
             <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
                <Users className="w-32 h-32 text-[#d1a64b]" />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-16 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Halaman Dalam Tahap Pengembangan</h2>
        <p className="text-slate-600 mb-8">Kami sedang memperbarui informasi terkait daftar Komisi dan Badan Otonom MUI DKI Jakarta.</p>
        <button className="bg-[#0f5132] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0b3c22] transition-colors shadow-lg">
          Kembali ke Beranda
        </button>
      </div>

    </div>
  );
}
