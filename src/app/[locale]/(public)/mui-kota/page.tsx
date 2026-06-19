"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ChevronRight, Loader2, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function MuiKotaPage() {
  const [muiKotaList, setMuiKotaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/muikota');
        if (res.data.success) {
          setMuiKotaList(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch MUI Kota data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardColors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-red-600',
    'bg-cyan-600',
    'bg-teal-600',
    'bg-purple-600',
    'bg-rose-600'
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">MUI Kota Administrasi</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Informasi dan tautan menuju website resmi MUI tingkat Kota Administrasi dan Kabupaten di Provinsi DKI Jakarta.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm mb-12">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-700 font-bold">MUI Kota Administrasi</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-emerald-600 pb-4 inline-block">Daftar Kota Administrasi</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
          ) : muiKotaList.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Belum ada data MUI Kota.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {muiKotaList.map((kota, i) => {
                const color = cardColors[i % cardColors.length];
                return (
                  <div key={kota.id} className="flex gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group cursor-pointer hover:-translate-y-1">
                    <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col h-full w-full">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1" title={kota.kota}>{kota.kota}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2" title={kota.alamat}>{kota.alamat || '-'}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between w-full">
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                          <Users className="w-4 h-4 mr-1 text-slate-400" /> {(kota.pimpinan_count || 0) + (kota.anggota_count || 0)} Anggota
                        </div>
                        <Link href={`/mui-kota/${kota.id}`} className="text-emerald-600 text-xs font-bold inline-block group-hover:translate-x-1 transition-transform bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100">
                          Lihat Detail &rarr;
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
