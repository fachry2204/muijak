"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon, Film, Link as LinkIcon, X } from 'lucide-react';

export default function CreateGaleriPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [type, setType] = useState('image'); // 'image' or 'video'
  const [mediaUrl, setMediaUrl] = useState('');
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = selectedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension to ensure good quality but small size
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Attempt compression with 0.7 quality to reach < 1MB without blurring too much
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              }));
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          }, 'image/jpeg', 0.75);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Judul wajib diisi');
      return;
    }
    
    if (type === 'image' && files.length === 0) {
      alert('Pilih minimal satu foto');
      return;
    }
    
    if (type === 'video' && !mediaUrl) {
      alert('Tautan Video YouTube wajib diisi');
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);
    setStatusMsg('Memproses gambar...');
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      if (eventDate) formData.append('event_date', eventDate);
      
      if (type === 'image') {
        // Compress images before appending
        for (let i = 0; i < files.length; i++) {
          setStatusMsg(`Mengompresi gambar ${i + 1} dari ${files.length}...`);
          try {
            // Only compress if file is larger than 500KB to save time
            if (files[i].file.size > 500 * 1024) {
              const compressedFile = await compressImage(files[i].file);
              formData.append('files', compressedFile);
            } else {
              formData.append('files', files[i].file);
            }
          } catch (err) {
            console.error('Compression failed for', files[i].file.name, err);
            // Fallback to original if compression fails
            formData.append('files', files[i].file);
          }
        }
      } else if (type === 'video') {
        formData.append('media_url', mediaUrl);
      }

      setStatusMsg('Mengunggah ke server...');
      
      const res = await axios.post('/api/galleries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      if (res.data.success) {
        setStatusMsg('Selesai!');
        alert('Galeri berhasil ditambahkan!');
        router.push('/admin/galeri');
        router.refresh();
      }
    } catch (error) {
      alert('Gagal menyimpan galeri');
      setStatusMsg('');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/galeri">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tambah Galeri</h1>
          <p className="text-slate-500 mt-1">Unggah banyak foto sekaligus atau tambahkan URL video YouTube.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Media</CardTitle>
            <CardDescription>Pilih jenis media, tuliskan judul yang menarik, lalu unggah foto atau masukkan URL video.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-3">
              <Label>Jenis Media</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setType('image'); setMediaUrl(''); }}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${type === 'image' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="font-bold">Gambar / Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setType('video'); setFiles([]); }}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${type === 'video' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <Film className="w-8 h-8" />
                  <span className="font-bold">Video YouTube</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul Galeri <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="Contoh: Rapat Kerja Daerah MUI Jakarta 2024" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Kegiatan (Opsional)</Label>
                <Input 
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            {type === 'image' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Unggah Foto (Bisa lebih dari 1 file) <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Klik atau seret gambar ke sini</p>
                    <p className="text-xs text-slate-500 mt-1">Anda bisa memilih banyak foto sekaligus (Bulk Upload)</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preview Foto yang Akan Diupload ({files.length})</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {files.map((f, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                          <img src={f.preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => removeFile(index)}
                              className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                              title="Batal upload foto ini"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'video' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <Film className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-800">
                    Sistem hanya mengizinkan video yang bersumber dari <b>YouTube</b> agar server tetap stabil. Masukkan URL YouTube di bawah ini.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Tautan Video YouTube <span className="text-red-500">*</span></Label>
                  <div className="flex relative">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <Input 
                      className="rounded-l-none" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      required={type === 'video'}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              {isSaving && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                    <span>{statusMsg}</span>
                    {uploadProgress > 0 && <span>{uploadProgress}%</span>}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress > 0 ? uploadProgress : 100}%`, opacity: uploadProgress > 0 ? 1 : 0.5 }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-[#0F5132] hover:bg-[#167046] px-8">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? 'Menyimpan...' : 'Publish Galeri'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
