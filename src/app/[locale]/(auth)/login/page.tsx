"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShieldCheck, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post('/api/auth/login', data);
      if (res.data.success) {
        // Force hard refresh to update session state correctly
        window.location.href = '/admin/dashboard';
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Gagal login, periksa email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#043b23] via-[#0A6B41] to-[#043b23] overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat" style={{ backgroundSize: '300px' }}></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d1a64b] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl z-10"
      >
        <Link href="/" className="inline-flex items-center text-emerald-100 hover:text-white transition-colors mb-6 font-medium group text-sm md:text-base">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Halaman Utama
        </Link>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side: Information */}
          <div className="w-full md:w-5/12 bg-slate-50 p-8 md:p-10 flex flex-col justify-between border-r border-slate-100 relative overflow-hidden hidden md:flex">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <img src="/gambar/logoweb.png" alt="MUI Logo" className="h-16 mb-8" />
              <h2 className="text-2xl font-black text-slate-800 mb-4 leading-tight">
                Sistem Manajemen Informasi MUI DKI Jakarta
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                Portal resmi terintegrasi untuk pengelolaan data kepengurusan, fatwa, dan informasi layanan masyarakat.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Keamanan Data Terjamin</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">Seluruh data organisasi dan layanan terenkripsi dan dijaga kerahasiaannya.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Akses Manajemen Terpusat</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">Mudah mengelola anggota, agenda, dan perizinan dalam satu dashboard interaktif.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-slate-200">
              <p className="text-xs text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} Majelis Ulama Indonesia Provinsi DKI Jakarta. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-10 text-center md:text-left">
                <img src="/gambar/logoweb.png" alt="MUI Logo" className="h-12 mb-6 mx-auto md:hidden" />
                <h3 className="text-3xl font-black text-slate-800 mb-2">Selamat Datang</h3>
                <p className="text-slate-500 text-sm">Silakan masuk menggunakan kredensial admin Anda.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                    {errorMsg}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-bold">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register('email')}
                    className="bg-slate-50 h-14 rounded-xl border-slate-200 focus:bg-white focus:ring-emerald-500 focus:border-emerald-500 transition-all px-4"
                  />
                  {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
                    <a href="#" className="text-xs text-emerald-600 font-bold hover:text-emerald-700 hover:underline">Lupa Password?</a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register('password')}
                    className="bg-slate-50 h-14 rounded-xl border-slate-200 focus:bg-white focus:ring-emerald-500 focus:border-emerald-500 transition-all px-4"
                  />
                  {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>}
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading} className="w-full bg-[#0F5132] hover:bg-[#0a3622] h-14 rounded-xl text-md font-bold shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                  </Button>
                </div>
              </form>
              
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center gap-2">
                <span className="text-slate-400 text-xs">Akses sistem ini dilindungi dan hanya untuk pengurus terdaftar.</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
