"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Film, Trash2, Loader2, ExternalLink, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function GaleriPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  const fetchGalleries = async () => {
    try {
      const res = await axios.get('/api/galleries');
      if (res.data.success) {
        setGalleries(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus item ini dari galeri?')) {
      try {
        await axios.delete(`/api/galleries/${id}`);
        fetchGalleries();
      } catch (error) {
        alert('Gagal menghapus');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Galeri</h1>
          <p className="text-slate-500 mt-1">Kelola galeri gambar dan video.</p>
        </div>
        <Link href="/admin/galeri/create">
          <Button className="bg-[#0F5132] hover:bg-[#167046]">
            <Plus className="w-4 h-4 mr-2" /> Tambah Galeri
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('image')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-[#0F5132] text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
          >
            <ImageIcon className="w-4 h-4" /> Galeri Foto
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'video' ? 'bg-[#0F5132] text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
          >
            <Film className="w-4 h-4" /> Galeri Video
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleries.filter(g => g.type === activeTab && g.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
            let mediaUrls: string[] = [];
            try {
              mediaUrls = JSON.parse(item.media_url);
            } catch (e) {
              // fallback if it's old data that wasn't json
              mediaUrls = [item.media_url];
            }
            
            const coverUrl = mediaUrls[0];
            const hasMultiple = mediaUrls.length > 1;

            return (
            <Card key={item.id} className="overflow-hidden group">
              <Link href={`/admin/galeri/${item.id}`}>
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer">
                {item.type === 'video' ? (
                  <>
                    <Film className="w-12 h-12 text-slate-300 absolute z-0" />
                    {coverUrl.includes('youtube.com') || coverUrl.includes('youtu.be') ? (
                      <img 
                        src={`https://img.youtube.com/vi/${coverUrl.split('v=')[1]?.split('&')[0] || coverUrl.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`} 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Video';
                        }}
                      />
                    ) : (
                      <video src={coverUrl} className="w-full h-full object-cover relative z-10" />
                    )}
                    <div className="absolute top-2 right-2 z-20 bg-black/60 px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                      <Film className="w-3 h-3" /> Video
                    </div>
                  </>
                ) : (
                  <>
                    <img src={coverUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 z-20 bg-emerald-600/90 px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> {hasMultiple ? `${mediaUrls.length} Foto` : 'Foto'}
                    </div>
                  </>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                  <div className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors text-slate-800" title="Buka Galeri">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item.id); }} 
                    className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors text-white" 
                    title="Hapus Galeri"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              </Link>
              <CardContent className="p-4">
                <h3 className="font-bold text-slate-800 line-clamp-2" title={item.title}>{item.title}</h3>
                <p className="text-xs text-slate-500 mt-2">
                  {item.event_date 
                    ? `Kegiatan: ${new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` 
                    : `Diupload: ${new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  }
                </p>
              </CardContent>
            </Card>
          )})}
          
          {galleries.filter(g => g.type === activeTab && g.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              {activeTab === 'image' ? <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" /> : <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />}
              <p className="text-slate-500 font-medium">Belum ada galeri {activeTab === 'image' ? 'foto' : 'video'} yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
