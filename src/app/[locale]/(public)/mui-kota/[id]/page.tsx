"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Loader2, Phone, Search, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500">Memuat Peta...</div>
});

function MemberTable({ title, members, colorClass, bgClass }: { title: string, members: any[], colorClass: string, bgClass: string }) {
  const [search, setSearch] = useState('');

  const filtered = members.filter(m => m.nama.toLowerCase().includes(search.toLowerCase()) || (m.jabatan || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`bg-white rounded-3xl p-8 border border-${colorClass}-100 shadow-xl shadow-${colorClass}-900/5`}>
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

export default function PublicMuiKotaDetail() {
  const params = useParams();
  const id = params.id as string;

  const [viewData, setViewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/muikota/${id}`);
        if (res.data.success) {
          setViewData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching MUI Kota detail:', error);
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
        <p className="text-emerald-800 font-medium animate-pulse">Memuat data MUI Kota...</p>
      </div>
    );
  }

  if (!viewData) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8">Halaman MUI Kota yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/mui-kota" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const pimpinan = viewData.anggota?.filter((a:any) => a.status === 'Pimpinan') || [];
  const anggota = viewData.anggota?.filter((a:any) => a.status !== 'Pimpinan') || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">{viewData.kota}</h1>
          <p className="text-emerald-100 text-lg flex items-center justify-center gap-2 max-w-xl mx-auto">
            <MapPin className="w-5 h-5 text-emerald-300" /> {viewData.alamat || 'Alamat Belum Tersedia'}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 -mt-20 relative z-20">
        <Link href="/mui-kota" className="inline-flex items-center text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full mb-6 font-medium text-sm transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Kota
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-fit lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="font-bold text-slate-800 text-xl border-b border-slate-100 pb-4 mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Kota</h4>
                  <p className="text-slate-800 font-bold text-lg">{viewData.kota}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Kantor</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{viewData.alamat || 'Belum diisi'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">No. Telepon</h4>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Phone className="w-4 h-4 text-emerald-600" /> {viewData.no_telp || 'Belum diisi'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Peta Lokasi</h4>
                  <div className="rounded-2xl overflow-hidden border-2 border-slate-100 pointer-events-none opacity-90 h-[250px] mb-3">
                    <MapPin className="hidden" />
                    <MapPicker 
                      lat={Number(viewData.map_lat || -6.200000)} 
                      lng={Number(viewData.map_lng || 106.816666)} 
                      address={viewData.alamat} 
                      onChange={() => {}} 
                    />
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${Number(viewData.map_lat || -6.200000)},${Number(viewData.map_lng || 106.816666)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 py-3 rounded-xl font-bold transition-colors text-sm border border-slate-200 hover:border-emerald-200"
                  >
                    <ExternalLink className="w-4 h-4" /> Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <MemberTable 
              title="Daftar Pimpinan" 
              members={pimpinan} 
              colorClass="emerald" 
              bgClass="bg-emerald-600"
            />
            <MemberTable 
              title="Daftar Anggota / Pengurus" 
              members={anggota} 
              colorClass="blue" 
              bgClass="bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
