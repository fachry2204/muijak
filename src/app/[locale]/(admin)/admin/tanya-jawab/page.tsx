"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Edit, Loader2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function TanyaJawabAdminPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/tanya-jawab');
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      try {
        await axios.delete(`/api/tanya-jawab/${id}`);
        fetchQuestions();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  const filteredData = questions.filter(item => 
    item.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Tanya Jawab</h1>
          <p className="text-slate-500 mt-1">Kelola pertanyaan dari umat dan berikan jawaban dari Ulama.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pertanyaan Umat</CardTitle>
          <CardDescription>Semua daftar pertanyaan yang diajukan via halaman Tanya Ulama.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input placeholder="Cari penanya atau isi pertanyaan..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-500">Penanya</th>
                  <th className="px-4 py-3 font-medium text-slate-500 min-w-[250px]">Pertanyaan</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Tanggal</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500">Tidak ada pertanyaan yang ditemukan.</td></tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{item.nama_lengkap}</p>
                        <p className="text-xs text-slate-500">{item.kota || 'Tidak diketahui'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="line-clamp-2" title={item.pertanyaan}>{item.pertanyaan}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Dijawab' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/tanya-jawab/${item.id}/jawab`}>
                            <Button variant="outline" size="sm" className="h-8 flex gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50" title="Jawab">
                              <MessageSquare className="w-4 h-4" /> Jawab
                            </Button>
                          </Link>
                          <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
