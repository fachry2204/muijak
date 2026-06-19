"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, User, MapPin, Calendar, PlayCircle, ChevronDown, ChevronUp, Loader2, BookOpen, MessageCircle } from 'lucide-react';

export default function JawabanUlamaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchJawaban = async () => {
      try {
        const res = await axios.get('/api/jawaban-ulama');
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load jawaban ulama");
      } finally {
        setLoading(false);
      }
    };
    fetchJawaban();
  }, []);

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Islamic Dark Green Gradient */}
      <div className="bg-gradient-to-br from-[#022c22] via-[#047857] to-[#064e3b] text-white py-16 relative overflow-hidden">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/50">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Kumpulan Jawaban Ulama</h1>
          <p className="text-emerald-50 text-lg max-w-2xl mx-auto leading-relaxed">
            Eksplorasi kumpulan tanya jawab agama seputar ibadah, muamalah, akidah, dan lain-lain yang dijawab langsung oleh dewan asatidz dan ulama MUI DKI Jakarta.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-20 pb-16">
        {/* Statistics Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex items-center justify-center gap-6 text-center transform transition-all hover:-translate-y-1">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pertanyaan Dijawab</p>
            <p className="text-4xl font-black text-slate-800">{loading ? '-' : items.length}</p>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
              <p className="text-slate-500 font-medium">Memuat data jawaban...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-200 flex flex-col items-center">
              <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Pertanyaan</h3>
              <p className="text-slate-500 max-w-md mx-auto">Saat ini belum ada pertanyaan yang berhasil dijawab oleh tim fatwa MUI. Silakan kunjungi kembali nanti.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg"
              >
                {/* Question Header */}
                <div 
                  className={`p-6 cursor-pointer transition-colors ${expandedId === item.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      <User className="w-3.5 h-3.5 text-emerald-600" /> {item.nama_lengkap}
                    </span>
                    {item.kota && (
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" /> {item.kota}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                      <span className="text-amber-500 mr-2 font-black">Q:</span>
                      {item.pertanyaan}
                    </h3>
                    <div className={`mt-1 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Answer Content */}
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedId === item.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 md:p-8 border-t-2 border-emerald-100 bg-gradient-to-b from-emerald-50/30 to-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      {item.ulama_photo ? (
                        <div className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-200 shadow-lg shadow-emerald-200">
                          <img src={item.ulama_photo} alt={item.ulama_penjawab} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#047857] to-[#022c22] text-white rounded-2xl items-center justify-center font-black text-xl shadow-lg shadow-emerald-200">
                          A
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="mb-4 inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-200 shadow-sm">
                          Dijawab oleh: {item.ulama_penjawab}
                        </div>
                        <div className="text-slate-700 leading-loose text-base whitespace-pre-wrap font-serif">
                          {item.jawaban}
                        </div>

                        {item.video_url && (
                          <div className="mt-8 pt-6 border-t border-slate-100">
                            <a 
                              href={item.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-800 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold text-sm border border-slate-200 shadow-sm"
                            >
                              <PlayCircle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                              Tonton Video Penjelasan di Youtube
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
