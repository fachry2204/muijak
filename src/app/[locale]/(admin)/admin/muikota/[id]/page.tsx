"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ArrowLeft, Loader2, Search, Pencil, Check, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500">Memuat Peta...</div>
});

function MemberTable({ title, members, isPimpinan, colorClass, bgClass, onRefresh }: { title: string, members: any[], isPimpinan: boolean, colorClass: string, bgClass: string, onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nama: '', jabatan: '', bidang: '', no_hp: '' });

  const filtered = members.filter(m => m.nama.toLowerCase().includes(search.toLowerCase()) || (m.jabatan || '').toLowerCase().includes(search.toLowerCase()));

  const handleEditClick = (m: any) => {
    setEditingId(m.id);
    setEditForm({ nama: m.nama, jabatan: m.jabatan || '', bidang: m.bidang || '', no_hp: m.no_hp || '' });
  };

  const handleSave = async (id: number) => {
    try {
      await axios.put(`/api/muikota/anggota/${id}`, editForm);
      setEditingId(null);
      onRefresh();
    } catch (error) {
      alert('Gagal mengupdate data.');
    }
  };

  return (
    <Card className={`border-${colorClass}-100`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800 flex items-center">
            <div className={`w-2 h-6 ${bgClass} rounded-full mr-2`}></div>
            {title}
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Cari nama/jabatan..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                {!isPimpinan && <th className="px-4 py-3 font-medium">Bidang</th>}
                <th className="px-4 py-3 font-medium">No. Telepon</th>
                <th className="px-4 py-3 font-medium text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isPimpinan ? 4 : 5} className="text-center py-8 italic text-slate-400">Tidak ada data ditemukan.</td>
                </tr>
              ) : (
                filtered.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <Input className="h-8 text-sm" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} />
                      ) : (
                        <span className="font-bold text-slate-800">{m.nama}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <Input className="h-8 text-sm" value={editForm.jabatan} onChange={e => setEditForm({...editForm, jabatan: e.target.value})} />
                      ) : (
                        <span className={`text-${colorClass}-600 font-medium`}>{m.jabatan || '-'}</span>
                      )}
                    </td>
                    {!isPimpinan && (
                      <td className="px-4 py-3">
                        {editingId === m.id ? (
                          <Input className="h-8 text-sm" value={editForm.bidang} onChange={e => setEditForm({...editForm, bidang: e.target.value})} />
                        ) : (
                          m.bidang || '-'
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <Input className="h-8 text-sm" value={editForm.no_hp} onChange={e => setEditForm({...editForm, no_hp: e.target.value})} />
                      ) : (
                        m.no_hp || '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === m.id ? (
                        <div className="flex justify-end gap-1">
                          <Button onClick={() => handleSave(m.id)} size="sm" variant="outline" className="h-7 w-7 p-0 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"><Check className="w-4 h-4" /></Button>
                          <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="h-7 w-7 p-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"><X className="w-4 h-4" /></Button>
                        </div>
                      ) : (
                        <Button onClick={() => handleEditClick(m)} size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit"><Pencil className="w-3 h-3 text-blue-600" /></Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DetailMuiKotaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const locale = params.locale as string;

  const [viewData, setViewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
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

  const refreshData = async () => {
    try {
      const res = await axios.get(`/api/muikota/${id}`);
      if (res.data.success) {
        setViewData(res.data.data);
      }
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!viewData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-700">Data Tidak Ditemukan</h2>
        <Button onClick={() => router.push(`/${locale}/admin/muikota`)} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const pimpinan = viewData.anggota?.filter((a:any) => a.status === 'Pimpinan') || [];
  const anggota = viewData.anggota?.filter((a:any) => a.status !== 'Pimpinan') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.push(`/${locale}/admin/muikota`)} variant="outline" size="sm" className="h-10 px-3">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" /> Profil {viewData.kota}
          </h1>
          <p className="text-slate-500 mt-1">Detail alamat, peta lokasi, dan daftar susunan kepengurusan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-200 h-fit sticky top-24">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Informasi Kantor</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Nama Kota</h4>
                <p className="text-slate-700 font-medium">{viewData.kota}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Alamat Kantor</h4>
                <p className="text-slate-700 font-medium">{viewData.alamat || '-'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">No. Telepon</h4>
                <p className="text-slate-700 font-medium">{viewData.no_telp || '-'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1 mb-2">Peta Lokasi</h4>
                <div className="rounded-lg overflow-hidden border border-slate-200 pointer-events-none opacity-80 h-[250px]">
                  <MapPicker 
                    lat={Number(viewData.map_lat || -6.200000)} 
                    lng={Number(viewData.map_lng || 106.816666)} 
                    address={viewData.alamat} 
                    onChange={() => {}} 
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500 text-center">
                  {Number(viewData.map_lat || 0).toFixed(6)}, {Number(viewData.map_lng || 0).toFixed(6)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <MemberTable 
            title="Daftar Pimpinan" 
            members={pimpinan} 
            isPimpinan={true} 
            colorClass="emerald" 
            bgClass="bg-emerald-600"
            onRefresh={refreshData}
          />
          <MemberTable 
            title="Daftar Anggota / Pengurus" 
            members={anggota} 
            isPimpinan={false} 
            colorClass="blue" 
            bgClass="bg-blue-600"
            onRefresh={refreshData}
          />
        </div>
      </div>
    </div>
  );
}
