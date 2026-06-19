"use client";

import { useState, useEffect, use, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Plus, Loader2, Save, Image as ImageIcon, Film } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';

export default function AdminGalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  
  const [gallery, setGallery] = useState<any>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`/api/galleries/${unwrappedParams.id}`);
      if (res.data.success) {
        const data = res.data.data;
        setGallery(data);
        setTitle(data.title || '');
        setEventDate(data.event_date ? new Date(data.event_date).toISOString().split('T')[0] : '');
        
        let urls: string[] = [];
        try {
          urls = JSON.parse(data.media_url);
        } catch (e) {
          urls = [data.media_url];
        }
        setMediaUrls(urls);
        if (data.type === 'video') {
          setVideoUrl(urls[0] || '');
        }
      }
    } catch (error) {
      console.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [unwrappedParams.id]);

  const handleUpdateInfo = async () => {
    setSavingInfo(true);
    try {
      await axios.put(`/api/galleries/${unwrappedParams.id}`, {
        action: 'update_info',
        title,
        event_date: eventDate || null
      });
      alert('Info galeri berhasil diperbarui!');
    } catch (error) {
      alert('Gagal memperbarui info galeri.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleUpdateVideo = async () => {
    if (!videoUrl) return;
    setSavingInfo(true);
    try {
      await axios.put(`/api/galleries/${unwrappedParams.id}`, {
        action: 'update_media',
        media_urls: [videoUrl]
      });
      setMediaUrls([videoUrl]);
      alert('URL Video berhasil diperbarui!');
    } catch (error) {
      alert('Gagal memperbarui video.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleDeleteImage = async (indexToDelete: number) => {
    if (!confirm('Yakin ingin menghapus gambar ini dari album?')) return;
    
    const newUrls = mediaUrls.filter((_, idx) => idx !== indexToDelete);
    try {
      await axios.put(`/api/galleries/${unwrappedParams.id}`, {
        action: 'update_media',
        media_urls: newUrls
      });
      setMediaUrls(newUrls);
    } catch (error) {
      alert('Gagal menghapus gambar.');
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await axios.post(`/api/galleries/${unwrappedParams.id}`, formData);
      if (res.data.success) {
        setMediaUrls(res.data.media_urls);
        alert('Gambar berhasil ditambahkan!');
      }
    } catch (error) {
      alert('Gagal mengunggah gambar.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  if (!gallery) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Galeri Tidak Ditemukan</h2>
        <Link href="/admin/galeri" className="mt-4 inline-block text-[#0F5132] hover:underline">
          Kembali ke Daftar Galeri
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/galeri">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Detail Galeri</h1>
          <p className="text-slate-500 mt-1">Kelola informasi dan media untuk album ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi Galeri */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Informasi Galeri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Album / Video</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Kegiatan (Opsional)</label>
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
              <div className="px-3 py-2 border rounded-md bg-slate-50 text-slate-500 capitalize flex items-center gap-2">
                {gallery.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                {gallery.type}
              </div>
            </div>
            
            <Button 
              onClick={handleUpdateInfo} 
              disabled={savingInfo || !title}
              className="w-full bg-[#0F5132] hover:bg-[#167046]"
            >
              {savingInfo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan Info
            </Button>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Media Manager */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manajemen Media</CardTitle>
            {gallery.type === 'image' && (
              <div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleAddImages}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Tambah Gambar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {gallery.type === 'video' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Video (YouTube / MP4)</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={videoUrl} 
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                    <Button onClick={handleUpdateVideo} disabled={savingInfo || !videoUrl}>Update URL</Button>
                  </div>
                </div>
                
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
                  {mediaUrls[0] && (mediaUrls[0].includes('youtube.com') || mediaUrls[0].includes('youtu.be')) ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${mediaUrls[0].split('v=')[1]?.split('&')[0] || mediaUrls[0].split('youtu.be/')[1]?.split('?')[0]}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  ) : mediaUrls[0] ? (
                    <video src={mediaUrls[0]} controls className="w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">Tidak ada video</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {mediaUrls.length === 0 ? (
                  <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-slate-400">
                    Belum ada gambar. Silakan tambah gambar.
                  </div>
                ) : (
                  mediaUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-slate-100 border border-slate-200">
                      <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDeleteImage(index)}
                          className="rounded-full w-10 h-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
