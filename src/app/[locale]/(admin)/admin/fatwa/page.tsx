"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, FileText, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminFatwaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fatwas, setFatwas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFatwas = async () => {
    try {
      const res = await axios.get('/api/fatwa');
      if (res.data.success) {
        setFatwas(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch fatwas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFatwas();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus fatwa ini?')) {
      try {
        await axios.delete(`/api/fatwa/${id}`);
        fetchFatwas();
      } catch (error) {
        alert('Gagal menghapus fatwa');
      }
    }
  };

  const filteredFatwas = fatwas.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Fatwa</h1>
          <p className="text-slate-500 mt-1">Kelola dokumen fatwa, putusan, dan pedoman MUI untuk publikasi.</p>
        </div>
        <Link href="/admin/fatwa/create">
          <Button className="bg-[#0F5132] hover:bg-[#167046] text-white flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Tambah Fatwa Baru
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Daftar Dokumen Fatwa
            </CardTitle>
            
            {/* Search and Filter */}
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Cari judul atau nomor fatwa..." 
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="border-slate-200 bg-slate-50 rounded-md px-3 border text-sm outline-none focus:border-emerald-500">
                <option value="ALL">Semua Tipe</option>
                <option value="PUSAT">MUI Pusat</option>
                <option value="DKI">MUI DKI Jakarta</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Judul & Nomor Fatwa</th>
                  <th className="px-6 py-4">Penerbit</th>
                  <th className="px-6 py-4">Tanggal Rilis</th>
                  <th className="px-6 py-4">File (PDF)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                ) : filteredFatwas.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data fatwa.</td></tr>
                ) : (
                  filteredFatwas.map((fatwa) => (
                    <tr key={fatwa.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 mb-1">{fatwa.title}</div>
                        <div className="text-xs text-slate-500 font-mono">{fatwa.no}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${fatwa.type === 'MUI Pusat' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {fatwa.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{fatwa.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Download className="w-4 h-4" /> {fatwa.size || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${fatwa.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {fatwa.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(fatwa.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
