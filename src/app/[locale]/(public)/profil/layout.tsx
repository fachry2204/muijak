"use client";

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ChevronRight, Building2, Target, Award, Users, MapPin } from 'lucide-react';
import { ReactNode } from 'react';

export default function ProfilLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">Profil Kelembagaan</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat sejarah, visi, misi, serta susunan kepengurusan Majelis Ulama Indonesia Provinsi DKI Jakarta sebagai pelayan umat dan mitra pemerintah.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/profil" className="hover:text-emerald-600">Profil</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-700 font-bold">Detail Profil</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar Nav */}
          <div className="lg:w-[25%] shrink-0">
            <div className="sticky top-32 bg-white rounded-xl shadow-sm border border-slate-200 p-2 space-y-1">
               <Link 
                 href="/profil/sejarah"
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${pathname?.includes('/sejarah') ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Building2 className="w-5 h-5" /> Sejarah Singkat
               </Link>
               <Link 
                 href="/profil/visi-misi"
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${pathname?.includes('/visi-misi') ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Target className="w-5 h-5" /> Visi & Misi
               </Link>
               <Link 
                 href="/profil/pimpinan"
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${pathname?.includes('/pimpinan') ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Award className="w-5 h-5" /> Profil Pimpinan
               </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-[75%]">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px]">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
