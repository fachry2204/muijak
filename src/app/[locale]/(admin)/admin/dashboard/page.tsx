import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Users, Eye, ShieldCheck } from 'lucide-react';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface RecentActivity extends RowDataPacket {
  id: string;
  title_id: string;
  created_at: Date | string;
  author_name: string;
}

function formatRelativeTime(dateValue: Date | string) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000));
  if (elapsedSeconds < 60) return 'Baru saja';
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)} menit yang lalu`;
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)} jam yang lalu`;
  if (elapsedSeconds < 2592000) return `${Math.floor(elapsedSeconds / 86400)} hari yang lalu`;
  return new Date(dateValue).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  const userPromise = session?.id
    ? pool.query<RowDataPacket[]>('SELECT name FROM users WHERE id = ? LIMIT 1', [session.id])
    : Promise.resolve([[] as RowDataPacket[], []] as const);
  const activityPromise = pool.query<RecentActivity[]>(`
    SELECT n.id, n.title_id, n.created_at,
      COALESCE(NULLIF(TRIM(u.name), ''), SUBSTRING_INDEX(u.email, '@', 1), 'Pengguna tidak dikenal') AS author_name
    FROM news n
    LEFT JOIN users u ON u.id = n.author_id
    ORDER BY n.created_at DESC
    LIMIT 5
  `);

  const [userResult, activityResult] = await Promise.all([userPromise, activityPromise]);
  const currentUser = userResult[0][0];
  const recentActivities = activityResult[0];
  const userName = currentUser?.name?.trim() || session?.email?.split('@')[0] || 'Pengguna';

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 border-l-4 border-l-emerald-600">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Assalammualaikum, <span className="text-emerald-600 capitalize">{userName}</span>!
        </h1>
        <p className="text-slate-500 mt-1 text-base md:text-lg">
          Selamat datang di Dashboard CMS MUI DKI JAKARTA.
        </p>
      </div>
      
      <h2 className="text-xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Berita</CardTitle>
            <Newspaper className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-slate-400 mt-1">+12 bulan ini</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Anggota</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-slate-400 mt-1">+150 bulan ini</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-slate-400 mt-1">Butuh verifikasi</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pengunjung</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-slate-400 mt-1">+5.2K bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        <span className="font-semibold">{activity.author_name}</span> menambahkan berita baru &quot;{activity.title_id}&quot;
                      </p>
                      <p className="text-xs text-slate-500">{formatRelativeTime(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada aktivitas berita.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-sm h-full bg-emerald-900 text-white border-0">
            <CardHeader>
              <CardTitle className="text-emerald-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-emerald-800 hover:bg-emerald-700 p-3 rounded-lg text-left text-sm font-medium transition-colors">
                + Tulis Berita Baru
              </button>
              <button className="w-full bg-emerald-800 hover:bg-emerald-700 p-3 rounded-lg text-left text-sm font-medium transition-colors">
                ✓ Verifikasi Anggota
              </button>
              <button className="w-full bg-emerald-800 hover:bg-emerald-700 p-3 rounded-lg text-left text-sm font-medium transition-colors">
                ⚙️ Pengaturan Website
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
