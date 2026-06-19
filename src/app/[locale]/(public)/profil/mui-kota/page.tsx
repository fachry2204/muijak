"use client";

import { MapPin } from 'lucide-react';

export default function MuiKotaPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-2 border-b-2 border-emerald-600 pb-4 inline-block">MUI Kota Administrasi</h2>
      <p className="text-slate-500 mb-8 mt-2">Informasi dan tautan menuju website resmi MUI tingkat Kota Administrasi dan Kabupaten di Provinsi DKI Jakarta.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
}
