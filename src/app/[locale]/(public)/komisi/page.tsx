"use client";

import { CheckCircle, FileText, Users, ArrowRight } from 'lucide-react';

export default function KomisiPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/gambar/patternbg.png')] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <span className="bg-[#d1a64b] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">MUI DKI Jakarta</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Bidang & Komisi & Badan<br/>Otonom</h1>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl">
              Mengenal lebih dekat struktur, tugas pokok, dan fungsi dari setiap bidang & komisi yang mengabdi di Majelis Ulama Indonesia Provinsi DKI Jakarta.
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
        <p className="text-slate-600 mb-8">Kami sedang memperbarui informasi terkait daftar Bidang & Komisi dan Badan Otonom MUI DKI Jakarta.</p>
        <button className="bg-[#0f5132] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0b3c22] transition-colors shadow-lg">
          Kembali ke Beranda
        </button>
      </div>

    </div>
  );
}
