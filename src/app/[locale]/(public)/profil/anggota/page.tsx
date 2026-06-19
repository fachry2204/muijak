"use client";

import { UserCircle } from 'lucide-react';

export default function AnggotaPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-2 border-b-2 border-emerald-600 pb-4 inline-block">Direktori Anggota MUI</h2>
      <p className="text-slate-500 mb-8 mt-2">Daftar lengkap anggota dan kepengurusan bidang secara resmi.</p>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input type="text" placeholder="Cari nama anggota..." className="w-full h-12 rounded-lg border-slate-300 px-4 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <select className="h-12 rounded-lg border-slate-300 px-4 bg-white focus:ring-emerald-500">
            <option>Semua Komisi / Bidang</option>
            <option>Komisi Fatwa</option>
            <option>Komisi Infokom</option>
            <option>Komisi Dakwah</option>
          </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-emerald-800 text-white">
            <tr>
              <th className="p-4 rounded-tl-xl">Nama Lengkap</th>
              <th className="p-4">Jabatan / Komisi</th>
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
                <td className="p-4 text-slate-600">Anggota Komisi Fatwa</td>
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
  );
}
