"use client";

import { useState } from 'react';
import { ChevronRight, Award, Shield, Target, MapPin, Users, Building2, UserCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState('sejarah');

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#022c22] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("/gambar/patternbg.png")', backgroundRepeat: 'repeat', backgroundSize: 'auto' }}></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">Profil Kelembagaan</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat sejarah, visi, misi, serta susunan kepengurusan Majelis Ulama Indonesia Provinsi DKI Jakarta sebagai pelayan umat dan mitra pemerintah.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-700 font-bold">Profil Kami</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar Nav */}
          <div className="lg:w-[25%] shrink-0">
            <div className="sticky top-32 bg-white rounded-xl shadow-sm border border-slate-200 p-2 space-y-1">
               <button 
                 onClick={() => setActiveTab('sejarah')}
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'sejarah' ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Building2 className="w-5 h-5" /> Sejarah Singkat
               </button>
               <button 
                 onClick={() => setActiveTab('visimisi')}
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'visimisi' ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Target className="w-5 h-5" /> Visi & Misi
               </button>
               <button 
                 onClick={() => setActiveTab('pimpinan')}
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'pimpinan' ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Award className="w-5 h-5" /> Profil Pimpinan
               </button>
               <button 
                 onClick={() => setActiveTab('anggota')}
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'anggota' ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Users className="w-5 h-5" /> Direktori Anggota
               </button>
               <button 
                 onClick={() => setActiveTab('muikota')}
                 className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'muikota' ? 'bg-[#105c36] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <MapPin className="w-5 h-5" /> MUI Kota Administrasi
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-[75%]">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px]">
              
              {/* TAB: Sejarah */}
              {activeTab === 'sejarah' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-3xl font-black text-slate-800 mb-6 border-b-2 border-emerald-600 pb-4 inline-block">Sejarah Majelis Ulama Indonesia</h2>
                   <div className="prose prose-lg prose-emerald max-w-none">
                     <p>Majelis Ulama Indonesia (MUI) adalah wadah musyawarah para ulama, zuama, dan cendekiawan muslim dalam mengayomi umat dan mengembangkan kehidupan yang Islami serta meningkatkan partisipasi umat Islam dalam pembangunan nasional.</p>
                     <p>MUI Provinsi DKI Jakarta didirikan tidak lama setelah berdirinya MUI Pusat pada tanggal 26 Juli 1975 di Jakarta. Peran strategis ibu kota menjadikan MUI DKI Jakarta memiliki tanggung jawab yang sangat sentral dalam menjaga kondusivitas, keharmonisan umat beragama, serta menjadi pionir dalam melahirkan fatwa-fatwa dan program sosial kemasyarakatan yang adaptif.</p>
                     <img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop" className="w-full rounded-xl my-8 shadow-md" alt="Sejarah" />
                     <h3>Peran Sentral di Ibu Kota</h3>
                     <p>Seiring berjalannya waktu, MUI DKI Jakarta terus merevitalisasi perannya. Tidak sekadar memberi fatwa, MUI turut aktif dalam pendidikan kader ulama, perlindungan konsumen melalui sertifikasi halal, advokasi kemanusiaan, hingga resolusi konflik antarumat.</p>
                   </div>
                </div>
              )}

              {/* TAB: Visi Misi */}
              {activeTab === 'visimisi' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-emerald-600 pb-4 inline-block">Visi & Misi Kelembagaan</h2>
                   
                   <div className="bg-[#0f5132] text-white p-8 rounded-2xl shadow-lg mb-10 relative overflow-hidden">
                      <Target className="absolute -right-6 -bottom-6 w-48 h-48 text-emerald-800 opacity-20 pointer-events-none" />
                      <h3 className="text-2xl font-bold mb-4 relative z-10 text-[#d1a64b]">Visi</h3>
                      <p className="text-xl leading-relaxed font-medium relative z-10">
                        "Terciptanya kondisi masyarakat muslim di Provinsi DKI Jakarta yang berkualitas, berakhlakul karimah, sejahtera lahir dan batin, serta hidup dalam harmoni menuju Baldatun Thayyibatun Wa Rabbun Ghafur."
                      </p>
                   </div>

                   <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Shield className="text-emerald-600" /> Misi MUI DKI Jakarta</h3>
                   <div className="space-y-4">
                     {[
                       "Membimbing dan mengayomi umat Islam dalam menjalankan ajaran agama secara *kaffah*.",
                       "Memberikan fatwa dan nasehat mengenai masalah keagamaan dan kemasyarakatan kepada pemerintah dan umat.",
                       "Meningkatkan ukhuwah Islamiyah, ukhuwah wathaniyah, dan ukhuwah insaniyah dalam bingkai NKRI.",
                       "Menjadi penghubung (Muraqib) antara ulama dan umara untuk mensukseskan pembangunan manusia seutuhnya.",
                       "Mengawal kualitas produk halal, memajukan pendidikan kader ulama, dan merawat kelestarian lingkungan."
                     ].map((misi, i) => (
                       <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">{i+1}</div>
                         <p className="text-slate-700 text-lg leading-relaxed">{misi}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* TAB: Pimpinan */}
              {activeTab === 'pimpinan' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-3xl font-black text-slate-800 mb-2">Profil Pimpinan</h2>
                   <p className="text-slate-500 mb-8">Susunan Dewan Pimpinan Harian Majelis Ulama Indonesia Provinsi DKI Jakarta.</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                         <div className="h-64 overflow-hidden relative bg-slate-100">
                            <img src={`https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                               <span className="bg-[#d1a64b] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                 {i === 1 ? 'Ketua Umum' : i === 2 ? 'Sekretaris Umum' : 'Wakil Ketua'}
                               </span>
                            </div>
                         </div>
                         <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">KH. Nama Pimpinan, MA</h3>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                              Tokoh agama terkemuka yang memiliki dedikasi tinggi dalam dunia pendidikan dan dakwah Islamiyah di ibu kota. Aktif dalam berbagai organisasi keislaman nasional.
                            </p>
                            <button className="text-emerald-600 font-bold text-sm mt-4 hover:underline">Baca Biografi Lengkap &rarr;</button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* TAB: Direktori Anggota */}
              {activeTab === 'anggota' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-3xl font-black text-slate-800 mb-2">Direktori Anggota MUI</h2>
                   <p className="text-slate-500 mb-8">Daftar lengkap anggota dan kepengurusan bidang secara resmi.</p>
                   
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex gap-4">
                      <div className="flex-1 relative">
                        <input type="text" placeholder="Cari nama anggota..." className="w-full h-12 rounded-lg border-slate-300 px-4 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                      <select className="h-12 rounded-lg border-slate-300 px-4 bg-white focus:ring-emerald-500">
                        <option>Semua Komisi / Bidang</option>
                        <option>Komisi Fatwa</option>
                        <option>Komisi Infokom</option>
                        <option>Komisi Dakwah</option>
                      </select>
                   </div>

                   <div className="overflow-x-auto rounded-xl border border-slate-200">
                     <table className="w-full text-left text-sm">
                       <thead className="bg-emerald-800 text-white">
                         <tr>
                           <th className="p-4 rounded-tl-xl">Nama Lengkap</th>
                           <th className="p-4">Jabatan / Komisi</th>
                           <th className="p-4">Status</th>
                           <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 bg-white">
                         {[1,2,3,4,5,6].map((i) => (
                           <tr key={i} className="hover:bg-slate-50">
                             <td className="p-4 flex items-center gap-3">
                               <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                                  <UserCircle className="w-6 h-6 text-slate-400" />
                               </div>
                               <span className="font-bold text-slate-700">Ust. Ahmad Fulan, Lc.</span>
                             </td>
                             <td className="p-4 text-slate-600">Anggota Komisi Fatwa</td>
                             <td className="p-4">
                               <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">Terverifikasi</span>
                             </td>
                             <td className="p-4 text-center">
                               <button className="text-emerald-600 font-bold hover:underline">Lihat Profil</button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}

              {/* TAB: MUI Kota */}
              {activeTab === 'muikota' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-3xl font-black text-slate-800 mb-2">MUI Kota Administrasi</h2>
                   <p className="text-slate-500 mb-8">Informasi dan tautan menuju website resmi MUI tingkat Kota Administrasi dan Kabupaten di Provinsi DKI Jakarta.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { name: 'MUI Jakarta Pusat', addr: 'Jl. Tanah Abang I No.1', color: 'bg-blue-600' },
                       { name: 'MUI Jakarta Selatan', addr: 'Komplek Walikota Jaksel', color: 'bg-green-600' },
                       { name: 'MUI Jakarta Barat', addr: 'Jl. Raya Kembangan No.2', color: 'bg-amber-600' },
                       { name: 'MUI Jakarta Timur', addr: 'Jl. Dr. Sumarno', color: 'bg-red-600' },
                       { name: 'MUI Jakarta Utara', addr: 'Jl. Yos Sudarso No.27', color: 'bg-cyan-600' },
                       { name: 'MUI Kep. Seribu', addr: 'Pulau Pramuka', color: 'bg-teal-600' }
                     ].map((kota, i) => (
                       <div key={i} className="flex gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer">
                          <div className={`w-14 h-14 ${kota.color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-700 transition-colors">{kota.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">{kota.addr}</p>
                            <span className="text-emerald-600 text-sm font-bold mt-3 inline-block group-hover:translate-x-1 transition-transform">Kunjungi Web &rarr;</span>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
