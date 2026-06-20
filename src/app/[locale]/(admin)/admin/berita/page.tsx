"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';

export default function BeritaAdminPage() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PUBLISHED' | 'DRAFT' | 'TRASHED'>('PUBLISHED');
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [bulkAction, setBulkAction] = useState('trash');
  const [bulkCategory, setBulkCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [resNews, resCats] = await Promise.all([
        axios.get(`/api/news`),
        axios.get(`/api/categories`)
      ]);
      if (resCats.data.success) {
        setCategories(resCats.data.data);
      }
      if (resNews.data.success) {
        // Filter by tab and category
        const filtered = resNews.data.data.filter((n: any) => {
          const matchTab = n.status === activeTab;
          const matchCat = categoryFilter === 'ALL' || n.category_id == categoryFilter;
          return matchTab && matchCat;
        });
        setNews(filtered);
      }
    } catch (error) {
      console.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    setSelectedNews([]);
    setCurrentPage(1);
    setBulkAction(activeTab === 'TRASHED' ? 'restore' : 'trash');
  }, [activeTab, categoryFilter]);

  const handleDelete = async (id: string) => {
    const isTrashed = activeTab === 'TRASHED';
    const msg = isTrashed ? 'Apakah Anda yakin ingin menghapus PERMANEN berita ini?' : 'Pindahkan berita ini ke Tong Sampah?';
    if(confirm(msg)) {
      try {
        await axios.delete(`/api/news/${id}`);
        fetchNews();
        setSelectedNews(prev => prev.filter(i => i !== id));
      } catch (error) {
        alert('Gagal memproses berita');
      }
    }
  };

  const handleBulkAction = async () => {
    if (selectedNews.length === 0) {
      alert('Pilih berita terlebih dahulu!');
      return;
    }
    
    if (bulkAction === 'delete_permanent') {
      if(!confirm(`Yakin ingin MENGHAPUS PERMANEN ${selectedNews.length} berita?`)) return;
    } else if (bulkAction === 'trash') {
      if(!confirm(`Yakin ingin memindahkan ${selectedNews.length} berita ke Tong Sampah?`)) return;
    } else if (bulkAction === 'move_category') {
      if(!bulkCategory) {
        alert('Pilih kategori tujuan terlebih dahulu!');
        return;
      }
    }

    try {
      const res = await axios.post('/api/news/bulk', {
        action: bulkAction,
        ids: selectedNews,
        category_id: bulkCategory
      });
      if (res.data.success) {
        alert('Berhasil menerapkan aksi massal!');
        fetchNews();
        setSelectedNews([]);
      }
    } catch (error) {
      alert('Gagal menerapkan aksi massal');
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedNews(news.map(n => n.id));
    } else {
      setSelectedNews([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedNews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Berita</h1>
        <Link href="/admin/berita/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Berita
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center border-b pb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('PUBLISHED')}
              style={{ fontFamily: 'Arial, sans-serif' }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${activeTab === 'PUBLISHED' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Berita Tayang
            </button>
            <button
              onClick={() => setActiveTab('DRAFT')}
              style={{ fontFamily: 'Arial, sans-serif' }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${activeTab === 'DRAFT' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Draft Berita
            </button>
            <button
              onClick={() => setActiveTab('TRASHED')}
              style={{ fontFamily: 'Arial, sans-serif' }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${activeTab === 'TRASHED' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Berita Terhapus
            </button>
          </div>
          
          {/* Controls Right */}
          <div className="flex gap-4 items-center">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Filter Komisi/Bidang:</span>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Semua Komisi/Bidang</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_id}</option>
                ))}
              </select>
            </div>
            
            {/* Bulk Actions */}
            <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
              <select 
                value={bulkAction} 
                onChange={(e) => setBulkAction(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {activeTab !== 'TRASHED' ? (
                  <>
                    <option value="trash">Buang ke Tong Sampah</option>
                    <option value="move_category">Pindah Kategori</option>
                  </>
                ) : (
                  <>
                    <option value="restore">Kembalikan (Restore)</option>
                    <option value="delete_permanent">Hapus Permanen</option>
                  </>
                )}
              </select>
              
              {bulkAction === 'move_category' && (
                <select 
                  value={bulkCategory} 
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Tujuan --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name_id}</option>
                  ))}
                </select>
              )}
              
              <Button onClick={handleBulkAction} size="sm" className="bg-slate-800 hover:bg-slate-900 text-white px-4">
                Terapkan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[50px] text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                      onChange={toggleSelectAll}
                      checked={news.length > 0 && selectedNews.length === news.length}
                    />
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">Judul</TableHead>
                  <TableHead className="font-bold text-slate-900">Komisi/Bidang</TableHead>
                  <TableHead className="font-bold text-slate-900">Penulis</TableHead>
                  <TableHead className="font-bold text-slate-900">Status</TableHead>
                  <TableHead className="font-bold text-slate-900">Tanggal Terbit</TableHead>
                  <TableHead className="font-bold text-slate-900">Tanggal Upload</TableHead>
                  <TableHead className="text-right font-bold text-slate-900">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-8">Belum ada berita.</TableCell>
                  </TableRow>
                ) : (
                  news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                    <TableRow key={item.id} className={selectedNews.includes(item.id) ? "bg-emerald-50/50" : ""}>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                          onChange={() => toggleSelect(item.id)}
                          checked={selectedNews.includes(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[250px] truncate" title={item.title_id}>
                        {item.title_id}
                      </TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>{item.author_name || 'Admin'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : (item.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}`}>
                          {item.status === 'PUBLISHED' ? 'Tayang' : (item.status === 'DRAFT' ? 'Draf' : 'Terhapus')}
                        </span>
                      </TableCell>
                      <TableCell>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : (item.status === 'PUBLISHED' ? new Date(item.created_at).toLocaleDateString('id-ID') : '-')}</TableCell>
                      <TableCell>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <a href={`/berita/${item.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-600 h-8 w-8 transition-colors">
                          <Eye className="h-4 w-4" />
                        </a>
                        <Link href={`/admin/berita/edit/${item.id}`} className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 h-8 w-8 transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Button onClick={() => handleDelete(item.id)} variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {!loading && news.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
              <p className="text-sm text-slate-500">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, news.length)} dari total {news.length} berita
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <div className="px-4 py-1.5 text-sm font-medium border rounded-md bg-slate-50">
                  {currentPage} / {Math.ceil(news.length / itemsPerPage)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(news.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(news.length / itemsPerPage)}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
