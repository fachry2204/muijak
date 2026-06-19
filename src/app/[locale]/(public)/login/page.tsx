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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const tNav = useTranslations('Navigation');
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
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Gagal login, periksa email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-20 px-4 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 pt-20"
      >
        <Card className="border-0 shadow-2xl dark:bg-slate-900 rounded-3xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-[#D4AF37]"></div>
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg mx-auto mb-4">MUI</div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Portal Anggota</CardTitle>
            <CardDescription className="text-slate-500">Masuk ke sistem informasi MUI DKI Jakarta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@muijakarta.or.id" 
                  {...register('email')}
                  className="bg-slate-50 dark:bg-slate-800 h-12"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-emerald-600 hover:underline">Lupa Password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register('password')}
                  className="bg-slate-50 dark:bg-slate-800 h-12"
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-md mt-4">
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-6 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm text-slate-500">
              Belum punya akun? <a href="#" className="text-emerald-600 font-bold hover:underline">Daftar disini</a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
