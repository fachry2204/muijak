import pool from '@/lib/db';
import { ShieldCheck, XCircle } from 'lucide-react';

export default async function TestDbPage() {
  let isConnected = false;
  let errorMessage = '';
  let dbInfo: any = null;

  try {
    // Mencoba melakukan query sederhana
    const [rows]: any = await pool.query('SELECT VERSION() as version, DATABASE() as db_name');
    isConnected = true;
    dbInfo = rows[0];
  } catch (error: any) {
    isConnected = false;
    errorMessage = error.message || 'Gagal terhubung ke database';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className={`p-6 text-center ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isConnected ? (
              <ShieldCheck className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {isConnected ? 'Database Terhubung!' : 'Koneksi Gagal!'}
          </h1>
          <p className="text-white/80 text-sm">
            Halaman pengecekan status server database
          </p>
        </div>

        <div className="p-6">
          {isConnected ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium mb-1">Nama Database:</p>
                <p className="text-lg font-bold text-emerald-950">{dbInfo?.db_name || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Versi MySQL/MariaDB:</p>
                <p className="font-medium text-slate-800">{dbInfo?.version}</p>
              </div>
              <p className="text-xs text-center text-slate-400 mt-4">
                Sistem dapat membaca data. Konfigurasi .env Anda sudah benar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-red-800 font-bold mb-2">Pesan Error:</p>
                <p className="font-mono text-sm text-red-600 bg-white p-3 rounded border border-red-100 break-all">
                  {errorMessage}
                </p>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Solusi Perbaikan:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pastikan file <code>.env</code> sudah ada di Plesk.</li>
                  <li>Cek kembali <code>DB_HOST</code> (biasanya <code>localhost</code> atau <code>127.0.0.1</code>).</li>
                  <li>Pastikan password database tidak salah ketik.</li>
                  <li>Pastikan user database sudah diberikan "Full Access" ke database tersebut di Plesk.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
