"use client";

import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function MuiKotaPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/gambar/patternbg.png')] bg-repeat" style={{ backgroundSize: '200px' }}></div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'MUI Jakarta Pusat', addr: 'Jl. Tanah Abang I No.1', color: 'bg-blue-600' },
              { name: 'MUI Jakarta Selatan', addr: 'Komplek Walikota Jaksel', color: 'bg-green-600' },
              { name: 'MUI Jakarta Barat', addr: 'Jl. Raya Kembangan No.2', color: 'bg-amber-600' },
              { name: 'MUI Jakarta Timur', addr: 'Jl. Dr. Sumarno', color: 'bg-red-600' },
              { name: 'MUI Jakarta Utara', addr: 'Jl. Yos Sudarso No.27', color: 'bg-cyan-600' },
              { name: 'MUI Kep. Seribu', addr: 'Pulau Pramuka', color: 'bg-teal-600' }
            ].map((kota, i) => (
              <div key={i} className="flex gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer">
                <div className={`w-14 h-14 ${kota.color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-700 transition-colors">{kota.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{kota.addr}</p>
                  <span className="text-emerald-600 text-sm font-bold mt-3 inline-block group-hover:translate-x-1 transition-transform">Kunjungi Web &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
