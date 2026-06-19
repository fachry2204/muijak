"use client";

import { Link } from '@/i18n/routing';
import { Calendar, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export default function BeritaPage() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAllNews(data.data.filter((n: any) => n.status !== 'DRAFT'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(allNews.length / itemsPerPage);
  const currentNews = allNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const generatePagination = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-[#0b3c22]/90 py-16 relative overflow-hidden bg-[url('/gambar/bread.jpg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Berita Terbaru</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Ikuti perkembangan informasi, kegiatan, dan liputan seputar Majelis Ulama Indonesia Provinsi DKI Jakarta.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-12 relative z-10">
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-2 flex-wrap">
            <Button variant="default" className="bg-[#0f5132] hover:bg-[#0b3c22]">Semua Berita</Button>
            <Button variant="outline" className="text-slate-600">Kegiatan</Button>
            <Button variant="outline" className="text-slate-600">Fatwa</Button>
            <Button variant="outline" className="text-slate-600">PRK</Button>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 h-10 border-slate-200" placeholder="Cari berita..." />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Memuat berita...</div>
        ) : allNews.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">Belum ada berita.</div>
        ) : (
          <>
            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentNews.map((news, i) => (
                <Link href={`/berita/${news.slug}`} key={news.id || i} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col border border-slate-100">
                  <div className="h-40 overflow-hidden relative">
                    <img src={news.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={news.title_id} />
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className={`text-[10px] font-bold text-white px-2 py-1 rounded shadow-sm uppercase bg-emerald-600`}>
                        {news.category_name || 'Berita'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{news.views || 0}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {news.title_id}
                    </h3>
                    <div className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: news.content_id?.replace(/<[^>]+>/g, '').substring(0, 150) + '...' || '' }} />
                    <div className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca Selengkapnya <span>&rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    className={`w-10 h-10 p-0 ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:text-emerald-600'}`}
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </Button>
                  
                  {generatePagination().map((pageNum, idx) => (
                    <Button 
                      key={idx}
                      variant={currentPage === pageNum ? "default" : "outline"} 
                      className={`w-10 h-10 p-0 ${pageNum === '...' ? 'border-transparent hover:bg-transparent cursor-default' : currentPage === pageNum ? 'bg-[#0f5132] hover:bg-[#0b3c22]' : 'text-slate-600 hover:text-emerald-600'}`}
                      onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                      disabled={pageNum === '...'}
                    >
                      {pageNum}
                    </Button>
                  ))}

                  <Button 
                    variant="outline" 
                    className={`w-10 h-10 p-0 ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:text-emerald-600'}`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
