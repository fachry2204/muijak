"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, BarChart3, Users, Globe2, ArrowUpRight, ArrowDownRight, Link2, MonitorPlay, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  const metrics = data?.metrics || { total: 0, today: 0, month: 0, unique: 0 };
  const popularPages = data?.popularPages || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Statistik Web</h1>
        <p className="text-slate-500 mt-1">Laporan real-time pengunjung, popularitas halaman, dan data trafik dari database.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Kunjungan</p>
                <h3 className="text-2xl font-bold text-slate-800">{metrics.total.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              Sepanjang Waktu
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Kunjungan Hari Ini</p>
                <h3 className="text-2xl font-bold text-slate-800">{metrics.today.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              Dalam 24 jam terakhir
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Kunjungan Bulan Ini</p>
                <h3 className="text-2xl font-bold text-slate-800">{metrics.month.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <MonitorPlay className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              Dalam bulan berjalan
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Pengunjung Unik (IP)</p>
                <h3 className="text-2xl font-bold text-slate-800">{metrics.unique.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <LineChart className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              Berdasarkan IP Address
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Halaman Terpopuler */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Halaman Paling Sering Dikunjungi</CardTitle>
            <CardDescription>Berdasarkan URL yang diakses pengunjung (Real-time).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPages.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Belum ada data kunjungan halaman.</p>
              ) : (
                popularPages.map((item: any, idx: number) => {
                  const percentage = ((item.views / metrics.total) * 100).toFixed(1);
                  return (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-bold text-slate-700 font-mono truncate max-w-[200px] sm:max-w-[300px]" title={item.path}>
                          {item.path}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">{item.views.toLocaleString()}</p>
                        </div>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right hidden sm:block">{percentage}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Tambahan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" /> Log Kunjungan Terbaru
            </CardTitle>
            <CardDescription>10 akses halaman terbaru dari pengunjung web.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentVisitors?.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Belum ada log kunjungan.</p>
              ) : (
                data?.recentVisitors?.map((visitor: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0 text-sm">
                    <div className="overflow-hidden flex-1 mr-4">
                      <p className="font-bold text-slate-700">{visitor.ip_address}</p>
                      <p className="text-xs text-slate-500 truncate" title={visitor.user_agent}>{visitor.user_agent}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-emerald-600 text-xs">{visitor.path}</p>
                      <p className="text-xs text-slate-400">{new Date(visitor.created_at).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
