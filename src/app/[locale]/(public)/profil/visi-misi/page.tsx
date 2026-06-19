"use client";

import { Target, Shield } from 'lucide-react';

export default function VisiMisiPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-emerald-600 pb-4 inline-block">Visi & Misi Kelembagaan</h2>
      
      <div className="bg-[#0f5132] text-white p-8 rounded-2xl shadow-lg mb-10 relative overflow-hidden">
        <Target className="absolute -right-6 -bottom-6 w-48 h-48 text-emerald-800 opacity-20 pointer-events-none" />
        <h3 className="text-2xl font-bold mb-4 relative z-10 text-[#d1a64b]">Visi</h3>
        <p className="text-xl leading-relaxed font-medium relative z-10">
          "Terciptanya kondisi masyarakat muslim di Provinsi DKI Jakarta yang berkualitas, berakhlakul karimah, sejahtera lahir dan batin, serta hidup dalam harmoni menuju Baldatun Thayyibatun Wa Rabbun Ghafur."
        </p>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Shield className="text-emerald-600" /> Misi MUI DKI Jakarta</h3>
      <div className="space-y-4">
        {[
          "Membimbing dan mengayomi umat Islam dalam menjalankan ajaran agama secara *kaffah*.",
          "Memberikan fatwa dan nasehat mengenai masalah keagamaan dan kemasyarakatan kepada pemerintah dan umat.",
          "Meningkatkan ukhuwah Islamiyah, ukhuwah wathaniyah, dan ukhuwah insaniyah dalam bingkai NKRI.",
          "Menjadi penghubung (Muraqib) antara ulama dan umara untuk mensukseskan pembangunan manusia seutuhnya.",
          "Mengawal kualitas produk halal, memajukan pendidikan kader ulama, dan merawat kelestarian lingkungan."
        ].map((misi, i) => (
          <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">{i+1}</div>
            <p className="text-slate-700 text-lg leading-relaxed">{misi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
