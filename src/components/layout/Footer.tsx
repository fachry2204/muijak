"use client";

import { Link } from '@/i18n/routing';
import { MessageCircle, Globe, Share2, Tv, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const FooterMap = dynamic(() => import('@/components/ui/FooterMap'), { ssr: false });

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#0A3622] text-slate-300 pt-16 pb-8 border-t-4 border-emerald-500">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="mb-6">
              <img src={settings.footer_logo || settings.website_logo || "/gambar/logoweb.png"} alt="MUI Logo" className="h-16 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Wadah musyawarah para ulama, zuama, dan cendekiawan muslim di Provinsi DKI Jakarta untuk mengayomi umat dan mengembangkan kehidupan yang Islami.
            </p>
            <div className="flex gap-4">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><MessageCircle className="w-5 h-5" /></a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Share2 className="w-5 h-5" /></a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Tv className="w-5 h-5" /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
              Link Cepat
            </h3>
            <ul className="space-y-3">
              <li><Link href="/profil" className="hover:text-emerald-400 transition-colors">Profil Kami</Link></li>
              <li><Link href="/berita" className="hover:text-emerald-400 transition-colors">Berita Terbaru</Link></li>
              <li><Link href="/komisi" className="hover:text-emerald-400 transition-colors">Bidang & Komisi</Link></li>
              <li><Link href="/fatwa" className="hover:text-emerald-400 transition-colors">Kumpulan Fatwa</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{settings.address || 'Jl. Cikini Raya No.73, RT.1/RW.2, Cikini, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10330'}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{settings.phone || '(021) 3141151'}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{settings.email || 'sekretariat@muijakarta.or.id'}</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
              Lokasi
            </h3>
            <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-700">
              <FooterMap
                address={settings.address}
                lat={settings.map_lat ? parseFloat(settings.map_lat) : undefined}
                lng={settings.map_lng ? parseFloat(settings.map_lng) : undefined}
                zoom={15}
                label="MUI DKI Jakarta"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Majelis Ulama Indonesia Provinsi DKI Jakarta. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
