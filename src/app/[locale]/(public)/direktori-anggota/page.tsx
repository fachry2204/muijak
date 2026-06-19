"use client";

import { UserCircle, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function DirektoriAnggotaPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/gambar/patternbg.png')] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">Direktori Anggota</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Daftar lengkap anggota dan kepengurusan bidang secara resmi pada Majelis Ulama Indonesia Provinsi DKI Jakarta.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm mb-12">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-700 font-bold">Direktori Anggota</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black text-slate-800 mb-6 border-b-2 border-emerald-600 pb-4 inline-block">Cari Anggota</h2>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input type="text" placeholder="Cari nama anggota..." className="w-full h-12 rounded-lg border-slate-300 px-4 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <select className="h-12 rounded-lg border-slate-300 px-4 bg-white focus:ring-emerald-500">
                <option>Semua Bidang & Komisi</option>
                <option>Bidang & Komisi Fatwa</option>
                <option>Bidang & Komisi Infokom</option>
                <option>Bidang & Komisi Dakwah</option>
              </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="p-4 rounded-tl-xl">Nama Lengkap</th>
                  <th className="p-4">Jabatan / Bidang & Komisi</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[1,2,3,4,5,6].map((i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                          <UserCircle className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="font-bold text-slate-700">Ust. Ahmad Fulan, Lc.</span>
                    </td>
                    <td className="p-4 text-slate-600">Anggota Bidang & Komisi Fatwa</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">Terverifikasi</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-emerald-600 font-bold hover:underline">Lihat Profil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
