"use client";

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Share2, Globe, MessageCircle, Link as LinkIcon, ChevronRight, Calendar, User, Eye, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReadNewsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const publishedNews = data.data.filter((n: any) => String(n.status).toUpperCase() === 'PUBLISHED');
          setAllNews(publishedNews);
          const found = publishedNews.find((n: any) => n.slug === slug);
          if (found) {
            // Increment view locally and remotely
            found.views = (found.views || 0) + 1;
            setArticle(found);
            
            fetch(`/api/news/${found.id}/views`, { method: 'POST' }).catch(console.error);
          }
        }
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (!article) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1000px] mx-auto px-4 flex items-center text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-600">Beranda</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/berita" className="hover:text-emerald-600">Berita</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="#" className="hover:text-emerald-600">{article.category_name || 'News'}</Link>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 pt-10 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="lg:w-[70%]">
          
          {/* Article Header */}
          <div className="mb-8">
            <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 uppercase tracking-wider rounded">
              {article.category_name || 'News'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight mb-6">
              {article.title_id}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-200 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-700">{article.author_name || 'Tim Redaksi'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>{article.views || 0} Kali Dibaca</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8 shadow-md">
            <img src={article.image_url} alt={article.title_id} className="w-full h-auto object-cover aspect-video" />
            <div className="bg-slate-100 p-3 text-xs text-slate-500 text-center italic">
              {article.title_id}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-bold text-slate-700">Bagikan:</span>
            <button className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <Globe className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:-translate-y-1 transition-transform shadow">
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Rich Text Content */}
          <article className="prose prose-lg max-w-none prose-emerald prose-headings:font-bold prose-a:text-blue-600 mb-10">
            <div dangerouslySetInnerHTML={{ __html: article.content_id }} />
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 mb-12">
            <Tag className="w-5 h-5 text-slate-400 mr-2" />
            <span className="bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-xs font-bold px-3 py-1 rounded cursor-pointer">
              #BeritaMUI
            </span>
          </div>

          {/* Related News */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold border-l-4 border-emerald-600 pl-3 mb-6">Berita Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {allNews.filter(n => n.id !== article.id).slice(0, 8).map((related) => {
                const excerpt = related.content_id ? related.content_id.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').substring(0, 120) + '...' : '';
                return (
                  <Link href={`/berita/${related.slug}`} key={related.id} className="group cursor-pointer flex flex-col h-full">
                    <div className="rounded-lg overflow-hidden mb-3 aspect-[4/3] shrink-0">
                      <img src={related.image_url} alt={related.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-bold text-[14px] text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                      {related.title_id}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-auto leading-relaxed">
                      {excerpt}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="lg:w-[30%]">
          
          <div className="sticky top-24 space-y-8">
            {/* Trending */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-3 mb-4 uppercase">Terpopuler</h3>
              <div className="space-y-4">
                {allNews.slice(0, 5).map((item, index) => (
                  <Link href={`/berita/${item.slug}`} key={item.id} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-3 last:border-0">
                    <div className="text-2xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">0{index + 1}</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title_id}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Banner Ad */}
            <div className="bg-slate-200 h-[250px] rounded-xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-sm border border-slate-300">
              Banner Iklan
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
