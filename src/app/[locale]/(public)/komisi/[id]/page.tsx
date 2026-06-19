"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, FolderOpen, Search, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';

function MemberTable({ title, members, colorClass, bgClass }: { title: string, members: any[], colorClass: string, bgClass: string }) {
  const [search, setSearch] = useState('');

  const filtered = members.filter(m => m.nama.toLowerCase().includes(search.toLowerCase()) || (m.jabatan || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`bg-white rounded-3xl p-8 border border-${colorClass}-100 shadow-xl shadow-${colorClass}-900/5 mb-6`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-xl text-slate-800 flex items-center">
          <div className={`w-2.5 h-6 ${bgClass} rounded-full mr-3`}></div>
          {title}
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            placeholder="Cari nama/jabatan..." 
            className="pl-9 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-500">
            <tr>
              <th className="px-5 py-4 font-bold">Nama Lengkap</th>
              <th className="px-5 py-4 font-bold">Jabatan</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-600">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-10 italic text-slate-400">Tidak ada data ditemukan.</td>
              </tr>
            ) : (
              filtered.map((m: any, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800">{m.nama}</td>
                  <td className={`px-5 py-4 font-medium text-${colorClass}-600`}>{m.jabatan || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PublicKomisiDetail() {
  const params = useParams();
  const id = params.id as string;

  const [viewData, setViewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/komisi/${id}`);
        if (res.data.success) {
          setViewData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching Komisi detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen pb-20 flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-emerald-800 font-medium animate-pulse">Memuat kepengurusan...</p>
      </div>
    );
  }

  if (!viewData) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8">Halaman kepengurusan yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/komisi" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const mainMembers = viewData.anggota?.filter((a:any) => !a.sub_komisi_name) || [];
  
  // Group members by sub_komisi_name
  const subKomisiGroups: Record<string, any[]> = {};
  viewData.anggota?.forEach((a:any) => {
    if (a.sub_komisi_name) {
      if (!subKomisiGroups[a.sub_komisi_name]) subKomisiGroups[a.sub_komisi_name] = [];
      subKomisiGroups[a.sub_komisi_name].push(a);
    }
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg leading-tight">{viewData.name}</h1>
          <p className="text-emerald-100 text-lg flex items-center justify-center gap-2 max-w-xl mx-auto">
            <Users className="w-5 h-5 text-emerald-300" /> Total {viewData.members_count || 0} Anggota Terdaftar
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 -mt-20 relative z-20">
        <Link href="/komisi" className="inline-flex items-center text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full mb-6 font-medium text-sm transition-colors border border-white/20 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Komisi
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 h-fit lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="font-bold text-slate-800 text-xl border-b border-slate-100 pb-4 mb-6">Informasi Bidang</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Bidang / Komisi</h4>
                  <p className="text-slate-800 font-bold text-lg leading-tight">{viewData.name}</p>
                </div>
                {viewData.description && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi / Tugas Pokok</h4>
                    <div className="text-slate-600 font-medium leading-relaxed prose prose-sm max-w-none prose-emerald" dangerouslySetInnerHTML={{ __html: viewData.description }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <MemberTable 
              title="Daftar Anggota Utama" 
              members={mainMembers} 
              colorClass="emerald" 
              bgClass="bg-emerald-600"
            />
            
            {Object.entries(subKomisiGroups).map(([subName, members], idx) => {
              const colors = ['blue', 'amber', 'purple', 'rose', 'teal'];
              const col = colors[idx % colors.length];
              return (
                <MemberTable 
                  key={idx}
                  title={`Sub Komisi / Divisi: ${subName}`} 
                  members={members} 
                  colorClass={col} 
                  bgClass={`bg-${col}-600`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
