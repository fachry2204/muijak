"use client";

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { Image as ImageIcon, Film, X, ChevronLeft, ChevronRight, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Popup Modal States
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`/api/galleries/${unwrappedParams.id}`);
        if (res.data.success) {
          setGallery(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#0F5132] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat Galeri...</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Galeri Tidak Ditemukan</h3>
        <p className="text-slate-500 mb-6">Galeri yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link href="/galeri" className="px-6 py-2.5 bg-[#0F5132] text-white rounded-lg font-bold shadow-md hover:bg-[#0a3d24] transition-colors">
          Kembali ke Galeri
        </Link>
      </div>
    );
  }

  let mediaUrls: string[] = [];
  try {
    mediaUrls = JSON.parse(gallery.media_url);
  } catch (e) {
    mediaUrls = [gallery.media_url];
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Arial'] relative pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-16 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/galeri" className="inline-flex items-center text-emerald-100 hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Daftar Galeri
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-emerald-300">{gallery.title}</h1>
          <div className="flex items-center gap-4 text-emerald-100/90">
            {gallery.event_date && (
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-sm">
                Tanggal: {new Date(gallery.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-sm flex items-center gap-2">
              {gallery.type === 'image' ? <><ImageIcon className="w-4 h-4" /> {mediaUrls.length} Foto</> : <><Film className="w-4 h-4" /> Video</>}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
          
          {gallery.type === 'video' ? (
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
              {mediaUrls[0].includes('youtube.com') || mediaUrls[0].includes('youtu.be') ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${mediaUrls[0].split('v=')[1]?.split('&')[0] || mediaUrls[0].split('youtu.be/')[1]?.split('?')[0]}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <video src={mediaUrls[0]} controls className="w-full h-full" />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaUrls.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveImageIndex(index)}
                  className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-slate-100"
                >
                  <img 
                    src={url} 
                    alt={`${gallery.title} - Foto ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {activeImageIndex !== null && gallery.type === 'image' && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
          <div className="absolute top-4 md:top-6 right-4 md:right-6 z-50">
            <button 
              onClick={() => setActiveImageIndex(null)} 
              className="p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center">
            <div className="relative w-full flex items-center justify-center">
              <div className="relative group">
                <img 
                  src={mediaUrls[activeImageIndex]} 
                  alt={`Foto ${activeImageIndex + 1}`} 
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
                
                {mediaUrls.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev === 0 ? mediaUrls.length - 1 : (prev as number) - 1)); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 md:opacity-100 md:-left-20"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev === mediaUrls.length - 1 ? 0 : (prev as number) + 1)); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 md:opacity-100 md:-right-20"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                    
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-emerald-300 font-bold tracking-widest text-sm">
                      {activeImageIndex + 1} / {mediaUrls.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
