"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { 
  Menu, Search, Bell, Maximize, Moon, ChevronDown, 
  LayoutDashboard, FileText, Tags, Building2, UsersRound, 
  Settings, Users, LogOut, BookOpen, ExternalLink, LineChart, MapPin, HelpCircle, Images, UserCircle, Camera
} from 'lucide-react';

export default function AdminClientLayout({ children, session }: { children: React.ReactNode, session: any }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const menuGroups = [
    {
      title: "DASHBOARD",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      title: "CONTENT",
      items: [
        { name: "Berita", href: "/admin/berita", icon: FileText },
        { name: "Kategori Berita", href: "/admin/categories", icon: Tags },
        { name: "Fatwa", href: "/admin/fatwa", icon: BookOpen },
        { name: "Galeri", href: "/admin/galeri", icon: Images },
        { name: "Tanya Jawab", href: "/admin/tanya-jawab", icon: HelpCircle },
        { name: "Banner", href: "/admin/banner", icon: Camera }
      ]
    },
    {
      title: "ORGANIZATION",
      items: [
        { name: "Profil & Organisasi", href: "/admin/profil", icon: Building2 },
        { name: "Bidang & Komisi", href: "/admin/komisi", icon: UsersRound },
        { name: "MUI Kota", href: "/admin/muikota", icon: MapPin }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Profil Saya", href: "/admin/profile", icon: UserCircle },
        { name: "Statistik Web", href: "/admin/analytics", icon: LineChart },
        ...(session?.role === 'ADMIN' ? [{ name: "Data User", href: "/admin/users", icon: Users }] : []),
        { name: "Pengaturan", href: "/admin/settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-['Arial'] text-slate-800">
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center">
            <img src="/gambar/logoweb.png" className="h-10 w-auto" alt="MUI Logo" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <div 
                className="px-8 mb-2 flex items-center justify-between cursor-pointer group"
                onClick={() => toggleGroup(group.title)}
              >
                <span className="text-xs font-bold text-slate-400 tracking-wider group-hover:text-slate-600 transition-colors">
                  {group.title}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsedGroups[group.title] ? 'rotate-180' : ''}`} />
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${collapsedGroups[group.title] ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname?.includes(item.href);
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center justify-between px-8 py-2.5 text-[14px] font-bold transition-colors ${
                          isActive 
                          ? 'text-emerald-600 border-l-4 border-emerald-600 bg-emerald-50/50 -ml-[4px]' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-l-4 border-transparent -ml-[4px]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 1.5} />
                          {item.name}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
            
            <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-full font-bold text-sm transition-colors mr-2">
              <ExternalLink className="w-4 h-4" /> Lihat Web
            </Link>
            
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            
            <Link href="/admin/profile" className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-2 rounded-lg transition-colors border border-transparent hover:border-slate-100">
              {session?.avatar_url ? <img src={session.avatar_url} alt={session?.name || 'User Avatar'} className="w-8 h-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{(session?.name || session?.email || 'U').slice(0, 2).toUpperCase()}</div>}
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-slate-700 leading-tight">{session?.name || (session?.email ? session.email.split('@')[0] : 'Admin User')}</span>
                <span className="text-[10px] font-medium text-slate-400">{session?.role}</span>
              </div>
            </Link>

            <button 
              onClick={async () => {
                try {
                  await axios.post('/api/auth/logout');
                  window.location.href = '/login';
                } catch (e) {}
              }}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center ml-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global styles for custom scrollbar to match Flowkit style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
