"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/routing';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function CreateBeritaPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [keywordTags, setKeywordTags] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [submitType, setSubmitType] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [showPreview, setShowPreview] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title_id: '',
      category_id: '',
      content_id: '',
      slug: '',
      meta_title: '',
      meta_desc: '',
      meta_keywords: '',
      youtube_url: '',
      image_main: null,
      published_at: new Date().toISOString().split('T')[0] // default today
    }
  });

  const titleWatch = watch('title_id');
  const contentWatch = watch('content_id');

  useEffect(() => {
    if (titleWatch) {
      const generatedSlug = titleWatch.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
      setValue('meta_title', titleWatch);

      const words = titleWatch.split(/\s+/).filter((w: string) => w.length > 3);
      const keywords = [...new Set(['MUI DKI', 'Berita', ...words])].join(', ');
      setValue('meta_keywords', keywords);
      setKeywordTags(keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean));
    }
  }, [titleWatch, setValue]);

  useEffect(() => {
    if (contentWatch) {
      const plainText = contentWatch.replace(/<[^>]+>/g, '').substring(0, 160);
      setValue('meta_desc', plainText);
    }
  }, [contentWatch, setValue]);

  const mainImageFile = watch('image_main');

  useEffect(() => {
    if (mainImageFile && (mainImageFile as any).length > 0) {
      const url = URL.createObjectURL((mainImageFile as any)[0]);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainImagePreview(null);
    }
  }, [mainImageFile]);

  useEffect(() => {
    if (galleryFiles && galleryFiles.length > 0) {
      const urls = galleryFiles.map(f => URL.createObjectURL(f));
      setGalleryPreviews(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setGalleryPreviews([]);
    }
  }, [galleryFiles]);

  const handleAddGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(f => f.size <= 2 * 1024 * 1024);
      if (validFiles.length !== newFiles.length) {
        alert('Beberapa gambar diabaikan karena ukurannya melebihi 2MB.');
      }
      setGalleryFiles(prev => [...prev, ...validFiles]);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title_id', data.title_id);
      formData.append('category_id', data.category_id.toString());
      formData.append('content_id', data.content_id);
      formData.append('slug', data.slug);
      formData.append('status', submitType);
      if (data.published_at) formData.append('published_at', data.published_at);
      if (data.meta_title) formData.append('meta_title', data.meta_title);
      if (data.meta_desc) formData.append('meta_desc', data.meta_desc);
      formData.append('meta_keywords', keywordTags.join(', '));

      if (data.image_main && data.image_main[0]) {
        formData.append('image_main', data.image_main[0]);
      }

      galleryFiles.forEach(file => {
        formData.append('gallery', file);
      });

      const res = await axios.post('/api/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        if (submitType === 'DRAFT') {
          alert('Berita berhasil disimpan sebagai Draft!');
        } else {
          alert('Berita berhasil ditayangkan!');
        }
        router.push('/admin/berita');
      }
    } catch (error: any) {
      console.error('Failed to create news:', error);
      const msg = error?.response?.data?.error || error?.message || 'Gagal membuat berita';
      alert(`Gagal membuat berita: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800">Tulis Berita Baru</h1>

      <Card>
        <CardHeader>
          <CardTitle>Form Berita (Multi Bahasa)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Konten Utama */}
            <div className="p-4 bg-slate-50 border rounded-lg space-y-4 shadow-sm">
              <h3 className="font-bold text-emerald-700 border-b pb-2">1. Konten Berita</h3>
              <div className="space-y-2">
                <Label htmlFor="title_id">Judul Berita</Label>
                <Input id="title_id" {...register('title_id', { required: true })} placeholder="Masukkan judul berita" className="text-lg font-semibold" />
                {errors.title_id && <span className="text-red-500 text-xs">Judul berita wajib diisi</span>}
              </div>

              {/* Tanggal Publish */}
              <div className="space-y-2">
                <Label htmlFor="published_at">Tanggal Publish Berita</Label>
                <Input 
                  id="published_at" 
                  type="date" 
                  {...register('published_at')} 
                  className="bg-white w-full max-w-xs"
                />
                <p className="text-xs text-slate-500">Tanggal ditayangkan. Default: hari ini. Bisa diubah untuk berita terdahulu.</p>
              </div>

              <div className="space-y-2 relative z-50">
                <Label htmlFor="category_id">Komisi/Bidang Atau Kategori Berita</Label>
                <Select onValueChange={(val) => setValue('category_id', val || '', { shouldValidate: true })} value={watch('category_id') || ""}>
                  <SelectTrigger className="w-full bg-white h-10">
                    <SelectValue placeholder="-- Pilih Komisi/Bidang --">
                      {watch('category_id') ? categories.find(c => c.id.toString() === watch('category_id')?.toString())?.name_id : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-64">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name_id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('category_id', { required: true })} />
                {errors.category_id && <span className="text-red-500 text-xs">Komisi/Bidang wajib dipilih</span>}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="image_main">Gambar Utama (Thumbnail) <span className="text-red-500">*</span></Label>
                <p className="text-xs text-slate-500 mb-2">Maksimal 2MB. Hanya format gambar (JPG, PNG, WEBP).</p>
                <div className="flex flex-col gap-4 items-start">
                  <div className="w-full">
                    <Input
                      id="image_main"
                      type="file"
                      accept="image/*"
                      {...register('image_main', {
                        required: true,
                        validate: (value: any) => {
                          if (value && value[0]) {
                            return value[0].size <= 2 * 1024 * 1024 || 'Ukuran gambar maksimal 2MB';
                          }
                          return true;
                        }
                      })}
                    />
                    {errors.image_main && <span className="text-red-500 text-xs block mt-1">{errors.image_main.message?.toString() || 'Gambar utama wajib diisi'}</span>}
                  </div>
                  {mainImagePreview && (
                    <div className="w-full max-w-sm rounded-md overflow-hidden border border-slate-200">
                      <img src={mainImagePreview} className="w-full h-auto object-cover" alt="Main Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="content_id">Isi Berita</Label>
                <p className="text-xs text-slate-500 mb-2">Anda dapat memasukkan gambar secara langsung di dalam editor dengan mengklik ikon gambar.</p>
                <RichTextEditor
                  content={watch('content_id')}
                  onChange={(val) => setValue('content_id', val)}
                />
              </div>
            </div>

            {/* Galeri Gambar */}
            <div className="p-4 bg-slate-50 border rounded-lg space-y-4 shadow-sm">
              <h3 className="font-bold text-emerald-700 border-b pb-2">2. Galeri Gambar</h3>
              <div className="space-y-2">
                <Label>Unggah Foto Galeri (Bisa Lebih dari 1)</Label>
                <p className="text-xs text-slate-500 mb-2">Maksimal 2MB per gambar. Format gambar. Klik tombol untuk terus menambahkan gambar.</p>
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    variant="outline"
                    className="border-dashed border-2 border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  >
                    + Tambahkan Gambar Galeri
                  </Button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddGalleryImages}
                  />
                </div>

                {/* Thumbnails Gallery */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4 bg-white p-3 border rounded-md">
                    {galleryPreviews.map((src, i) => (
                      <div key={i} className="aspect-square relative rounded-md overflow-hidden border border-slate-200 group">
                        <img src={src} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Media Upload */}
            <div className="p-4 bg-slate-50 border rounded-lg space-y-4 shadow-sm">
              <h3 className="font-bold text-emerald-700 border-b pb-2">3. Video Eksternal</h3>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">Youtube Video URL (Opsional)</Label>
                <Input id="youtube_url" {...register('youtube_url')} placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>

            {/* SEO & Meta */}
            <div className="p-4 bg-slate-50 border rounded-lg space-y-4 shadow-sm">
              <h3 className="font-bold text-emerald-700 border-b pb-2">4. Optimasi SEO (Search Engine Optimization)</h3>
              <p className="text-xs text-slate-500">Data SEO digenerate otomatis berdasarkan Judul dan Isi Berita. Anda dapat mengubahnya jika perlu.</p>

              <div className="space-y-2">
                <Label htmlFor="slug">Permalink / URL Slug</Label>
                <Input id="slug" {...register('slug', { required: true })} className="bg-white font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input id="meta_title" {...register('meta_title')} className="bg-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_desc">Meta Description</Label>
                <textarea
                  id="meta_desc"
                  {...register('meta_desc')}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                ></textarea>
              </div>

              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <div className="p-2 border rounded-md bg-white min-h-[42px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                  {keywordTags.map((tag, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setKeywordTags(prev => prev.filter((_, i) => i !== idx))}
                        className="text-emerald-600 hover:text-emerald-900 font-bold ml-1 rounded-full hover:bg-emerald-200 w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (keywordInput.trim() && !keywordTags.includes(keywordInput.trim())) {
                          setKeywordTags([...keywordTags, keywordInput.trim()]);
                          setKeywordInput('');
                        }
                      }
                    }}
                    placeholder="Ketik lalu tekan Enter..."
                    className="flex-1 outline-none bg-transparent min-w-[200px] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t mt-6">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700">
                  Pratinjau Berita
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setSubmitType('DRAFT')}
                  className="border-amber-500 text-amber-700 hover:bg-amber-50"
                >
                  {loading && submitType === 'DRAFT' ? 'Menyimpan...' : 'Simpan ke Draft'}
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={() => setSubmitType('PUBLISHED')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading && submitType === 'PUBLISHED' ? 'Menayangkan...' : 'Tayangkan Berita'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pratinjau Modal Overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="font-bold text-lg text-slate-800">Pratinjau Tampilan Berita</h2>
              <button onClick={() => setShowPreview(false)} className="text-slate-500 hover:text-red-500 font-bold bg-white border px-3 py-1 rounded-md shadow-sm">
                Tutup Pratinjau
              </button>
            </div>
            <div className="p-6 sm:p-10 overflow-y-auto bg-white flex-1">
              <article className="max-w-3xl mx-auto space-y-6">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  {titleWatch || 'Judul Berita Akan Tampil Di Sini'}
                </h1>

                {/* Meta info mock */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 pb-4 border-b">
                  <span className="flex items-center gap-1">👤 Admin MUI DKI</span>
                  <span className="flex items-center gap-1">
                    📁 {categories.find(c => c.id == watch('category_id'))?.name_id || 'Kategori Berita'}
                  </span>
                  <span className="flex items-center gap-1">📅 {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                {/* Main Image */}
                {mainImagePreview ? (
                  <img src={mainImagePreview} className="w-full rounded-xl object-cover max-h-[450px] shadow-sm" alt="Thumbnail" />
                ) : (
                  <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed">
                    [ Gambar Utama Belum Dipilih ]
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-emerald prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentWatch || '<p className="text-slate-400 italic">[ Isi berita masih kosong ]</p>' }} />

                {/* Gallery */}
                {galleryPreviews.length > 0 && (
                  <div className="mt-10 pt-8 border-t">
                    <h3 className="text-2xl font-bold mb-6 text-slate-800">Galeri Foto</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryPreviews.map((src, i) => (
                        <img key={i} src={src} className="w-full aspect-square object-cover rounded-lg shadow-sm hover:opacity-90 transition" alt={`Gallery Preview ${i}`} />
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
