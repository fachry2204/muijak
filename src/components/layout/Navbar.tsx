"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Menu, X, Search, UserCircle, ChevronDown, LogOut, MapPin, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

export function Navbar({ locale, dynamicMenus = [], session = null }: { locale: string, dynamicMenus?: any[], session?: any }) {
  const tNav = useTranslations('Navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [jadwalSholat, setJadwalSholat] = useState<any>(null);
  const [activeSholat, setActiveSholat] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('id-ID', options));

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

  type NavLink = { href: string; label: string; isExternal?: boolean; subMenus?: { href: string; label: string }[] };
  const defaultNavLinks: NavLink[] = [
    { href: '/', label: 'Beranda' },
    { 
      href: '/profil', 
      label: 'Profil',
      subMenus: [
        { href: '/profil/sejarah', label: 'Sejarah' },
        { href: '/profil/visi-misi', label: 'Visi Misi' },
        { href: '/profil/pimpinan', label: 'Pimpinan' },
        { href: '/direktori-anggota', label: 'Anggota MUI' },
        { href: '/mui-kota', label: 'MUI Kota' }
      ]
    },
    { 
      href: '/berita', 
      label: 'Berita'
    },
    { href: '/komisi', label: 'Bidang & Komisi' },
    { href: '/fatwa', label: 'Fatwa' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kontak', label: 'Kontak' },
  ];

  const getLocalizedTitle = (menu: any) => {
    if (locale === 'en' && menu.title_en) return menu.title_en;
    if (locale === 'ar' && menu.title_ar) return menu.title_ar;
    return menu.title_id;
  };

  const navLinks: NavLink[] = dynamicMenus.length > 0 
    ? dynamicMenus.filter(m => !m.parent_id).map(m => ({ href: m.url, label: getLocalizedTitle(m) }))
    : defaultNavLinks;

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <header className="w-full bg-white text-[#074c2e] sticky top-0 z-50 shadow-sm border-b border-gray-100 relative">
      {/* Top Bar */}
      <div className="hidden md:flex bg-[#043b23] text-[11px] lg:text-xs py-2 px-4 justify-center gap-12 lg:gap-24 items-center text-emerald-100/90 font-medium tracking-wide">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> DKI Jakarta
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {currentDate || 'Memuat...'}
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Jadwal Sholat:
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            {jadwalSholat ? (
              <>
                <span className={activeSholat === 'Subuh' ? 'text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20' : ''}>Subuh {jadwalSholat.subuh}</span>
                <span className={activeSholat === 'Dzuhur' ? 'text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20' : ''}>Dzuhur {jadwalSholat.dzuhur}</span>
                <span className={activeSholat === 'Ashar' ? 'text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20' : ''}>Ashar {jadwalSholat.ashar}</span>
                <span className={activeSholat === 'Maghrib' ? 'text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20' : ''}>Maghrib {jadwalSholat.maghrib}</span>
                <span className={activeSholat === 'Isya' ? 'text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20' : ''}>Isya {jadwalSholat.isya}</span>
              </>
            ) : (
              <span>Memuat jadwal...</span>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 h-20 flex items-center relative w-full">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 mr-12">
          <img src="/gambar/logoweb.png" alt="MUI Logo" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-bold text-[17px] font-['Arial'] z-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <div key={link.href} className="group relative">
                {link.isExternal ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 py-5 transition-colors hover:text-emerald-500 text-[#074c2e]`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    href={link.href}
                    className={`flex items-center gap-1 py-5 transition-colors hover:text-emerald-500 ${isActive ? 'text-emerald-600' : 'text-[#074c2e]'}`}
                  >
                    {link.label}
                    {link.subMenus && <ChevronDown className="w-4 h-4" />}
                  </Link>
                )}
                
                {/* Dropdown Menu */}
                {link.subMenus && (
                  <div className="absolute left-0 top-[60px] w-56 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[65px] transition-all duration-300 border border-slate-100 flex flex-col py-2 z-50">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100"></div>
                    {link.subMenus.map((sub: any) => (
                      <Link 
                        key={sub.href} 
                        href={sub.href}
                        className="px-5 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 text-[14px] font-semibold transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Right Icons (Absolute to Header) */}
      <div className="hidden xl:flex items-center gap-5 absolute right-6 top-[40px] md:top-[60px] lg:top-[64px] -translate-y-1/2 z-20">
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <button className="text-[#074c2e] hover:text-emerald-500 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 text-[#074c2e] hover:text-emerald-500 font-bold text-sm">
              <UserCircle className="w-5 h-5" /> {session.email.split('@')[0]}
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-colors text-sm shadow-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 bg-[#d1a64b] text-white px-4 py-2 rounded-full font-bold hover:bg-emerald-600 transition-colors text-sm shadow-sm">
            <UserCircle className="w-4 h-4" /> Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="lg:hidden text-[#074c2e] absolute right-4 top-[40px] md:top-[60px] lg:top-[64px] -translate-y-1/2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[70px] left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50">
          <div className="flex flex-col font-bold font-['Arial'] text-[16px] divide-y divide-gray-100 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.href} className="flex flex-col">
                {link.isExternal ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="p-4 hover:bg-emerald-50 text-[#074c2e] flex justify-between" onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="p-4 hover:bg-emerald-50 text-[#074c2e] flex justify-between" onClick={() => !link.subMenus && setMobileMenuOpen(false)}>
                    {link.label} {link.subMenus && <ChevronDown className="w-4 h-4" />}
                  </Link>
                )}
                {link.subMenus && (
                  <div className="flex flex-col bg-slate-50 border-l-4 border-emerald-500">
                    {link.subMenus.map((sub: any) => (
                      <Link key={sub.href} href={sub.href} className="p-3 pl-8 hover:bg-emerald-100 text-emerald-800 text-xs" onClick={() => setMobileMenuOpen(false)}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex gap-4 text-[#074c2e]">
                <Search className="w-5 h-5" />
              </div>
              {session ? (
                <div className="flex flex-col gap-2 w-full mt-2">
                  <Link href="/admin" className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle className="w-5 h-5" /> {session.email.split('@')[0]}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-bold">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center gap-2 bg-[#d1a64b] text-white px-4 py-3 rounded-lg font-bold mt-2" onClick={() => setMobileMenuOpen(false)}>
                  <UserCircle className="w-5 h-5" /> Login Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
