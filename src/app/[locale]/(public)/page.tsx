"use client";

import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Search, HelpCircle, Book, Users, ChevronRight, PlayCircle, Calendar, Quote, ShieldCheck, Download, MapPin, Mail, FileText, Eye } from 'lucide-react';
import { LiveEdit } from '@/components/ui/LiveEdit';

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
);

const ISLAMIC_QUESTIONS = [
  "Bagaimana pandangan Islam mengenai investasi pada platform P2P Lending digital saat ini?",
  "Apa hukum menggunakan paylater untuk belanja kebutuhan sehari-hari?",
  "Bagaimana adab bermedia sosial yang baik menurut tuntunan Rasulullah SAW?",
  "Apakah boleh mengqadha sholat fardhu yang ditinggalkan bertahun-tahun lalu?",
  "Apa hukum membaca Al-Quran melalui aplikasi di smartphone tanpa wudhu?",
  "Bagaimana pandangan fiqih mengenai transplantasi organ tubuh?",
  "Apakah zakat profesi wajib dikeluarkan setiap bulan atau menunggu setahun?",
  "Apa hukum bekerja di bank konvensional menurut fatwa MUI?",
  "Bagaimana cara membagi harta warisan untuk anak perempuan jika tidak ada anak laki-laki?",
  "Apakah sah sholat berjamaah mengikuti imam dari siaran langsung televisi?",
  "Apa hukumnya trading forex atau cryptocurrency dalam Islam?",
  "Bagaimana tuntunan Islam mengenai adopsi anak?",
  "Apakah boleh menyalurkan zakat fitrah dalam bentuk uang, bukan beras?",
  "Apa hukum operasi plastik untuk tujuan kecantikan dalam Islam?",
  "Bagaimana pandangan Islam tentang childfree atau memutuskan tidak memiliki anak?",
  "Apakah boleh menggabungkan niat puasa sunnah dengan puasa qadha Ramadhan?",
  "Apa hukumnya menggunakan fasilitas BPJS Kesehatan menurut pandangan syariat?",
  "Bagaimana cara membersihkan harta dari pendapatan yang bercampur dengan yang haram?",
  "Apakah wanita yang sedang haid boleh masuk ke dalam masjid untuk kajian?",
  "Apa hukum membeli barang sitaan bank atau barang lelang?"
];

export default function HomePage() {
  const [jadwalSholat, setJadwalSholat] = useState<any>(null);
  const [activeSholat, setActiveSholat] = useState<string>('');
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [randomQuestion, setRandomQuestion] = useState<string>("");

  useEffect(() => {
    // Set random question
    setRandomQuestion(ISLAMIC_QUESTIONS[Math.floor(Math.random() * ISLAMIC_QUESTIONS.length)]);

    // Fetch News
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDbNews(data.data.filter((n: any) => n.status === 'PUBLISHED'));
        }
      })
      .catch(err => console.error("Error fetching news:", err));

    // Fetch Jadwal Sholat
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    fetch(`https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`)
      .then(res => res.json())
      .then(data => {
        if (data.status && data.data && data.data.jadwal) {
          setJadwalSholat(data.data.jadwal);
          const now = date.getHours() * 60 + date.getMinutes();
          const parseTime = (timeStr: string) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
          };
          const times = [
            { name: 'Isya', time: parseTime(data.data.jadwal.isya) },
            { name: 'Maghrib', time: parseTime(data.data.jadwal.maghrib) },
            { name: 'Ashar', time: parseTime(data.data.jadwal.ashar) },
            { name: 'Dzuhur', time: parseTime(data.data.jadwal.dzuhur) },
            { name: 'Subuh', time: parseTime(data.data.jadwal.subuh) }
          ];
          let active = 'Isya';
          for (const t of times) {
            if (now >= t.time) {
              active = t.name;
              break;
            }
          }
          if (now < times[4].time) active = 'Isya';
          setActiveSholat(active);
        }
      })
      .catch(err => console.error("Error fetching jadwal sholat:", err));
  }, []);



  const u1 = dbNews[0];
  const u2 = dbNews[1];
  const u3 = dbNews[2];
  const u4 = dbNews[3];

  const l1 = dbNews[4];
  const l2 = dbNews[5];
  const l3 = dbNews[6];
  const l4 = dbNews[7];
  const l5 = dbNews[8];
  const l6 = dbNews[9];
  const l7 = dbNews[10];

  return (
    <div className="font-sans relative">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#043b23] to-[#0A6B41] pt-20 pb-40 overflow-hidden">
        {/* Pattern Background Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '200px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#047857]/30 to-transparent pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col lg:flex-row gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:w-[60%]">
            <span className="inline-block bg-[#047857]/50 text-emerald-50 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#047857]">
              <LiveEdit id="hero_badge" defaultText="MUI Provinsi DKI Jakarta" />
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <LiveEdit 
                id="hero_title" 
                defaultText="Official Website Majelis Ulama Indonesia <br/> <span class='text-[#f59e0b]'>Provinsi DKI Jakarta.</span>" 
              />
            </h1>
            <div className="text-emerald-100/90 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              <LiveEdit 
                id="hero_description" 
                multiline 
                defaultText="Satu portal digital MUI Provinsi DKI Jakarta untuk informasi, pelayanan, dan penguatan syiar Islam yang lebih cepat, transparan, dan terpercaya." 
              />
            </div>


          </div>

          {/* Right Hero Content */}
          <div className="lg:w-[40%] w-full">
            <div className="bg-[#047857]/30 backdrop-blur-md border border-[#047857]/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#f59e0b] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">Tanya Ulama Jakarta</h3>
                  <p className="text-emerald-100 text-sm">Layanan Pertanyaan Ummat</p>
                </div>
              </div>
              <div className="bg-[#022c22]/50 rounded-xl p-5 mb-6 border border-[#047857]/30 relative">
                <Quote className="absolute top-3 left-3 w-8 h-8 text-white/10" />
                <p className="text-emerald-50 text-sm leading-relaxed italic relative z-10 pl-6">
                  "{randomQuestion || ISLAMIC_QUESTIONS[0]}"
                </p>
              </div>
              <Link href="/tanya-ulama" className="w-full bg-white hover:bg-emerald-50 text-[#022c22] font-bold py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-md">
                Kirim Pertanyaan Anda <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK ACCESS FLOATING CARDS */}
      <section className="-mt-16 relative z-20 max-w-[1200px] mx-auto px-4 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Bank Fatwa", desc: "Kumpulan Fatwa MUI", icon: <ShieldCheck className="w-8 h-8" />, color: "text-blue-600", bg: "bg-blue-50", href: "/fatwa" },
            { title: "Tanya Ulama", desc: "Jawaban Dari Ulama", icon: <HelpCircle className="w-8 h-8" />, color: "text-[#f59e0b]", bg: "bg-amber-50", href: "/jawaban-ulama" },
            { title: "PKU MUI Jakarta", desc: "Pendidikan Kader Ulama", icon: <Book className="w-8 h-8" />, color: "text-[#047857]", bg: "bg-emerald-50", href: "https://pku.muijakarta.or.id", isExternal: true },
            { title: "Data Anggota", desc: "Nama Anggota MUI DKI Jakarta", icon: <Users className="w-8 h-8" />, color: "text-purple-600", bg: "bg-purple-50", href: "/komisi" }
          ].map((item, idx) => {
            const CardContent = (
              <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col items-center text-center h-full">
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            );

            return item.isExternal ? (
              <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer">
                {CardContent}
              </a>
            ) : (
              <Link key={idx} href={item.href}>
                {CardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* JADWAL SHOLAT SECTION */}
      <section className="mb-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-gradient-to-r from-[#047857] to-[#022c22] rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="flex-1 w-full relative z-10">
              <h3 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#f59e0b]" />
                Jadwal Sholat DKI Jakarta
              </h3>
              <p className="text-emerald-100 text-sm">Menampilkan jadwal sholat fardu harian berdasarkan titik koordinat ibu kota. Diperbarui secara otomatis.</p>
            </div>

            <div className="flex gap-2 md:gap-4 flex-wrap justify-center w-full lg:w-auto relative z-10">
              {jadwalSholat ? (
                [
                  { name: "Imsak", time: jadwalSholat.imsak },
                  { name: "Subuh", time: jadwalSholat.subuh, active: activeSholat === 'Subuh' },
                  { name: "Dzuhur", time: jadwalSholat.dzuhur, active: activeSholat === 'Dzuhur' },
                  { name: "Ashar", time: jadwalSholat.ashar, active: activeSholat === 'Ashar' },
                  { name: "Maghrib", time: jadwalSholat.maghrib, active: activeSholat === 'Maghrib' },
                  { name: "Isya", time: jadwalSholat.isya, active: activeSholat === 'Isya' }
                ].map((jadwal, idx) => (
                  <div key={idx} className={`rounded-xl p-3 md:p-4 min-w-[80px] md:min-w-[100px] text-center border transition-all ${jadwal.active ? 'bg-[#f59e0b] border-[#f59e0b] shadow-lg scale-110' : 'bg-[#022c22]/50 border-emerald-700/50 hover:bg-emerald-800/50'}`}>
                    <div className={`text-xs md:text-sm font-semibold mb-1 ${jadwal.active ? 'text-amber-950' : 'text-emerald-200'}`}>{jadwal.name}</div>
                    <div className={`text-lg md:text-2xl font-black ${jadwal.active ? 'text-white' : 'text-white'}`}>{jadwal.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-emerald-100 flex items-center justify-center h-[80px]">Memuat jadwal sholat Kemenag...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BERITA UTAMA SECTION */}
      <section className="mb-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#047857] rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Berita Utama</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Large Item */}
            {u1 && (
              <Link href={`/berita/${u1.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-[400px] lg:h-[450px]">
                <img src={u1.image_url} alt={u1.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-white text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {u1.category_name || 'Berita'}</span>
                  </div>
                  <h3 className="text-white text-2xl lg:text-3xl font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                    {u1.title_id}
                  </h3>
                </div>
              </Link>
            )}

            {/* Right Items */}
            <div className="flex flex-col gap-4">
              {/* Top Right */}
              {u2 && (
                <Link href={`/berita/${u2.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-[200px] lg:h-[217px]">
                  <img src={u2.image_url} alt={u2.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <span className="bg-white text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-2 inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {u2.category_name || 'Berita'}</span>
                    <h3 className="text-white text-lg lg:text-xl font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {u2.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Bottom Right Grid */}
              <div className="grid grid-cols-2 gap-4 h-[200px] lg:h-[217px]">
                {/* Bottom Left */}
                {u3 && (
                  <Link href={`/berita/${u3.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-full">
                    <img src={u3.image_url} alt={u3.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <span className="bg-white text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-2 inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {u3.category_name || 'Berita'}</span>
                      <h3 className="text-white text-sm font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                        {u3.title_id}
                      </h3>
                    </div>
                  </Link>
                )}

                {/* Bottom Right */}
                {u4 && (
                  <Link href={`/berita/${u4.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-full">
                    <img src={u4.image_url} alt={u4.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <span className="bg-white text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-2 inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {u4.category_name || 'Berita'}</span>
                      <h3 className="text-white text-sm font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                        {u4.title_id}
                      </h3>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA LAINNYA SECTION */}
      <section className="mb-24">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#d946ef] rounded-sm"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-wide">Berita Lainnya</h2>
            </div>
            <Link href="/berita" className="flex items-center gap-2 text-slate-800 font-bold hover:text-emerald-600 transition-colors text-sm">
              Lihat Semua Berita
              <div className="bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                <ChevronRight className="w-3 h-3 text-white ml-0.5" />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {/* Top Row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[350px]">
              {/* Top Row Item 1 */}
              {l1 && (
                <Link href={`/berita/${l1.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-[300px] md:h-full col-span-1">
                  <img src={l1.image_url} alt={l1.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-white text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {l1.category_name || 'Berita'}</span>
                    </div>
                    <h3 className="text-white text-base font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                      {l1.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Top Row Item 2 (Wide) */}
              {l2 && (
                <Link href={`/berita/${l2.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-[300px] md:h-full col-span-1 md:col-span-2">
                  <img src={l2.image_url} alt={l2.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-white text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {l2.category_name || 'Berita'}</span>
                    </div>
                    <h3 className="text-white text-xl md:text-2xl font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {l2.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Top Row Item 3 */}
              {l3 && (
                <Link href={`/berita/${l3.slug}`} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm h-[300px] md:h-full col-span-1">
                  <img src={l3.image_url} alt={l3.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-white text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div> {l3.category_name || 'Berita'}</span>
                    </div>
                    <h3 className="text-white text-base font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                      {l3.title_id}
                    </h3>
                  </div>
                </Link>
              )}
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Bottom Card 1 */}
              {l4 && (
                <Link href={`/berita/${l4.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="h-[180px] overflow-hidden">
                    <img src={l4.image_url} alt={l4.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> <span className="hover:underline hover:decoration-emerald-500">{l4.category_name || 'Berita'}</span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {l4.views || 0}</span></span>
                    </div>
                    <h3 className="text-slate-800 text-base font-black leading-snug group-hover:text-emerald-600 transition-colors line-clamp-3">
                      {l4.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Bottom Card 2 */}
              {l5 && (
                <Link href={`/berita/${l5.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="h-[180px] overflow-hidden">
                    <img src={l5.image_url} alt={l5.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> <span className="hover:underline hover:decoration-emerald-500">{l5.category_name || 'Berita'}</span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {l5.views || 0}</span></span>
                    </div>
                    <h3 className="text-slate-800 text-base font-black leading-snug group-hover:text-emerald-600 transition-colors line-clamp-3">
                      {l5.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Bottom Card 3 */}
              {l6 && (
                <Link href={`/berita/${l6.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="h-[180px] overflow-hidden">
                    <img src={l6.image_url} alt={l6.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> <span className="hover:underline hover:decoration-emerald-500">{l6.category_name || 'Berita'}</span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {l6.views || 0}</span></span>
                    </div>
                    <h3 className="text-slate-800 text-base font-black leading-snug group-hover:text-emerald-600 transition-colors line-clamp-3">
                      {l6.title_id}
                    </h3>
                  </div>
                </Link>
              )}

              {/* Bottom Card 4 */}
              {l7 && (
                <Link href={`/berita/${l7.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="h-[180px] overflow-hidden">
                    <img src={l7.image_url} alt={l7.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> <span className="hover:underline hover:decoration-emerald-500">{l7.category_name || 'Berita'}</span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {l7.views || 0}</span></span>
                    </div>
                    <h3 className="text-slate-800 text-base font-black leading-snug group-hover:text-emerald-600 transition-colors line-clamp-3">
                      {l7.title_id}
                    </h3>
                  </div>
                </Link>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
