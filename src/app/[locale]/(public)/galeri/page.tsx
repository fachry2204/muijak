"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Image as ImageIcon, Film, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function PublicGaleriPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  useEffect(() => {
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
    fetchGalleries();
  }, []);


  const filteredGalleries = galleries.filter(g => 
    g.type === activeTab && 
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalImageAlbums = galleries.filter(g => g.type === 'image').length;
  const totalVideoAlbums = galleries.filter(g => g.type === 'video').length;

  return (
    <div className="min-h-screen bg-slate-50 font-['Arial'] relative pb-20">
      
      {/* Hero / Breadcrumb Gradient Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-16 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-emerald-300">Galeri MUI DKI Jakarta</h1>
          <p className="text-lg text-emerald-100/90 max-w-2xl mx-auto">
            Dokumentasi kegiatan, acara, dan dakwah Majelis Ulama Indonesia Provinsi DKI Jakarta dalam bentuk foto dan video.
          </p>
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-200/50">
            <div>
              <p className="text-slate-500 font-medium mb-1">Total Album Foto</p>
              <h3 className="text-4xl font-bold text-[#043b23]">{totalImageAlbums}</h3>
            </div>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-200/50">
            <div>
              <p className="text-slate-500 font-medium mb-1">Total Album Video</p>
              <h3 className="text-4xl font-bold text-[#043b23]">{totalVideoAlbums}</h3>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Film className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Interactive Controls (Tabs & Search) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('image')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-[#0F5132] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            >
              <ImageIcon className="w-4 h-4" /> Galeri Foto
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'video' ? 'bg-[#0F5132] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            >
              <Film className="w-4 h-4" /> Galeri Video
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Cari album ${activeTab === 'image' ? 'foto' : 'video'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5132] transition-all"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#0F5132] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Memuat Galeri...</p>
          </div>
        ) : (
          <>
            {filteredGalleries.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                {activeTab === 'image' ? <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" /> : <Film className="w-16 h-16 mx-auto text-slate-300 mb-4" />}
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Tidak Ditemukan</h3>
                <p className="text-slate-500">Tidak ada album yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGalleries.map((item) => {
                  let mediaUrls: string[] = [];
                  try {
                    mediaUrls = JSON.parse(item.media_url);
                  } catch (e) {
                    mediaUrls = [item.media_url];
                  }
                  
                  const coverUrl = mediaUrls[0];
                  const hasMultiple = mediaUrls.length > 1;

                  return (
                    <a 
                      href={`/galeri/${item.id}`}
                      key={item.id} 
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:bg-slate-50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {item.type === 'video' ? (
                          <>
                            {coverUrl.includes('youtube.com') || coverUrl.includes('youtu.be') ? (
                              <img 
                                src={`https://img.youtube.com/vi/${coverUrl.split('v=')[1]?.split('&')[0] || coverUrl.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                              />
                            ) : (
                              <video src={coverUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-lg">
                                <Play className="w-6 h-6 ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img 
                              src={coverUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {hasMultiple && (
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> {mediaUrls.length} Foto
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="p-5 border-t border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2 group-hover:text-[#0F5132] transition-colors">{item.title}</h3>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {item.event_date 
                            ? new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                            : new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          }
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>


    </div>
  );
}
