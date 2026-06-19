"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Loader2, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function KomisiPage() {
  const [komisiList, setKomisiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKomisi = async () => {
      try {
        const res = await axios.get('/api/komisi');
        if (res.data.success) {
          setKomisiList(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch komisi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKomisi();
  }, []);

  const cardColors = [
    'from-emerald-500 to-emerald-700',
    'from-blue-500 to-blue-700',
    'from-amber-500 to-amber-700',
    'from-purple-500 to-purple-700',
    'from-rose-500 to-rose-700',
    'from-teal-500 to-teal-700',
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
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
             <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm relative">
                <Users className="w-32 h-32 text-[#d1a64b]" />
             </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm mb-12">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-700 font-bold">Bidang & Komisi</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-emerald-600 pb-4 inline-block">Daftar Komisi / Badan Otonom</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
          ) : komisiList.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Belum ada data Komisi.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {komisiList.map((item, index) => {
                const bgGradient = cardColors[index % cardColors.length];
                return (
                  <div key={item.id} className={`relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all group bg-gradient-to-br ${bgGradient} cursor-pointer hover:-translate-y-1`}>
                    <div 
                      className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    ></div>
                    <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                      <BookOpen className="w-32 h-32 text-white" />
                    </div>
                    <div className="p-6 relative z-10 flex flex-col h-full text-white">
                      <h3 className="font-bold text-xl mb-3 line-clamp-2 border-b border-white/20 pb-3 h-[64px]">{item.name}</h3>
                      <div className="space-y-3 mt-4 flex-grow">
                        <div className="flex items-center text-white/90 text-sm">
                          <Users className="w-4 h-4 mr-2 opacity-80 shrink-0" />
                          <span className="font-medium mr-1 shrink-0">Total Anggota:</span> 
                          <span className="font-bold text-white bg-white/20 px-3 py-0.5 rounded-full backdrop-blur-sm shadow-inner drop-shadow-sm">{item.members_count || 0}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20 flex justify-end">
                        <Link href={`/komisi/${item.id}`} className="inline-flex items-center text-sm font-bold bg-white text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm group-hover:shadow-md">
                          Lihat Kepengurusan <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
