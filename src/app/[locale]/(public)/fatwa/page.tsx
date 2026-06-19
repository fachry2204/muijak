"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Search, BookOpen, Library, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FatwaPage() {
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'MUI Pusat' | 'MUI DKI Jakarta'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [fatwas, setFatwas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFatwas = async () => {
      try {
        const res = await axios.get('/api/fatwa');
        if (res.data.success) {
          // Filter out drafts, only show published
          const published = res.data.data.filter((f: any) => f.status === 'Published');
          setFatwas(published);
        }
      } catch (err) {
        console.error("Failed to fetch fatwas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFatwas();
  }, []);

  const filteredFatwas = fatwas.filter(fatwa => {
    const matchTab = activeTab === 'SEMUA' || fatwa.type === activeTab;
    
    // Pecah kata pencarian berdasarkan spasi (sehingga "hidup sederhana" bisa dicari per kata)
    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const titleLower = fatwa.title.toLowerCase();
    const noLower = fatwa.no.toLowerCase();
    
    const matchSearch = searchWords.length === 0 || searchWords.every(word => 
      titleLower.includes(word) || noLower.includes(word)
    );
    
    return matchTab && matchSearch;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredFatwas.length / itemsPerPage);
  const paginatedFatwas = filteredFatwas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFatwa = fatwas.length;
  const totalPusat = fatwas.filter(f => f.type === 'MUI Pusat').length;
  const totalDKI = fatwas.filter(f => f.type === 'MUI DKI Jakarta').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Header Section with Dark Green Gradient */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 text-emerald-100 text-sm font-bold tracking-wider">
            DIREKTORI RESMI MUI
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Kumpulan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-[#d1a64b]">Fatwa & Pedoman</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
            Pusat penelusuran dokumen hukum dan pedoman resmi yang dikeluarkan oleh Majelis Ulama Indonesia (MUI) Pusat dan MUI DKI Jakarta.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-12 relative z-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden group border border-slate-100">
            <div className="relative z-10">
              <p className="text-slate-500 font-bold mb-1 uppercase text-xs tracking-wider">Total Fatwa Publik</p>
              <h3 className="text-4xl font-black text-emerald-700">{totalFatwa}</h3>
            </div>
            <Library className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-50 group-hover:scale-110 group-hover:text-emerald-100 transition-all duration-500" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden group border border-slate-100">
            <div className="relative z-10">
              <p className="text-slate-500 font-bold mb-1 uppercase text-xs tracking-wider">Fatwa MUI Pusat</p>
              <h3 className="text-4xl font-black text-blue-700">{totalPusat}</h3>
            </div>
            <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-50 group-hover:scale-110 group-hover:text-blue-100 transition-all duration-500" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden group border border-slate-100">
            <div className="relative z-10">
              <p className="text-slate-500 font-bold mb-1 uppercase text-xs tracking-wider">Fatwa MUI DKI Jakarta</p>
              <h3 className="text-4xl font-black text-[#b08b3c]">{totalDKI}</h3>
            </div>
            <CheckCircle2 className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-50 group-hover:scale-110 group-hover:text-amber-100 transition-all duration-500" />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-20 z-30">
          <div className="flex gap-2 w-full md:w-auto bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('SEMUA')}
              className={`px-4 py-2.5 rounded-md text-sm font-bold transition-all ${activeTab === 'SEMUA' ? 'bg-white text-emerald-700 shadow border border-slate-200/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-200/50'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('MUI Pusat')}
              className={`px-4 py-2.5 rounded-md text-sm font-bold transition-all ${activeTab === 'MUI Pusat' ? 'bg-white text-emerald-700 shadow border border-slate-200/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-200/50'}`}
            >
              MUI Pusat
            </button>
            <button
              onClick={() => setActiveTab('MUI DKI Jakarta')}
              className={`px-4 py-2.5 rounded-md text-sm font-bold transition-all ${activeTab === 'MUI DKI Jakarta' ? 'bg-white text-emerald-700 shadow border border-slate-200/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-200/50'}`}
            >
              MUI DKI Jakarta
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari judul atau nomor fatwa..."
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Fatwa List */}
        <div className="grid gap-3">
          {loading ? (
             <div className="py-20 flex flex-col justify-center items-center">
               <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
               <p className="text-slate-500 font-medium text-sm">Memuat data dokumen...</p>
             </div>
          ) : paginatedFatwas.length > 0 ? (
            paginatedFatwas.map((fatwa) => (
              <Card key={fatwa.id} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group border-slate-200 overflow-hidden cursor-default rounded-xl">
                <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                  {/* Icon Area */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:px-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-white text-emerald-600 border border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-4 md:py-4 md:px-6 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-md ${fatwa.type === 'MUI Pusat' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {fatwa.type}
                      </span>
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                        {fatwa.date}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {fatwa.title}
                    </h3>
                    <div className="mt-auto">
                      <span className="text-xs text-slate-500 font-mono bg-slate-50 inline-block px-2 py-1 rounded border border-slate-200 font-medium">
                        {fatwa.no}
                      </span>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="p-4 md:px-6 md:py-4 w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50 min-w-[160px]">
                    <span className="text-[11px] font-bold text-slate-400 block md:mb-1 uppercase tracking-wider">{fatwa.size || 'Unknown Size'} (PDF)</span>
                    <a href={fatwa.file_url || '#'} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="bg-[#047857] hover:bg-[#022c22] text-white w-full flex gap-1.5 rounded-lg px-4 py-2 h-9 shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold">
                        <Download className="w-3.5 h-3.5" /> UNDUH PDF
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-slate-500 max-w-md mx-auto">Kami tidak dapat menemukan dokumen fatwa yang sesuai dengan kata kunci "{searchQuery}". Coba gunakan istilah lain.</p>
            </div>
          )}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              className="w-10 h-10 p-0 rounded-full border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Simple pagination logic to show max 5 pages
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`w-10 h-10 p-0 rounded-full font-bold ${
                        currentPage === page 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                          : 'border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                }
                
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="flex items-center justify-center w-10 text-slate-400 font-bold">...</span>;
                }
                
                return null;
              })}
            </div>

            <Button
              variant="outline"
              className="w-10 h-10 p-0 rounded-full border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

      </div>
    </div >
  );
}
