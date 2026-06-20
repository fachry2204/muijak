import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { UserCheck } from 'lucide-react';

export default async function PimpinanPage() {
  let leaders: any[] = [];
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM leaders ORDER BY order_index ASC, id DESC');
    leaders = rows;
  } catch (error) {
    console.error("Failed to fetch leaders:", error);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-2 border-b-2 border-emerald-600 pb-4 inline-block">Profil Pimpinan</h2>
      <p className="text-slate-500 mb-8 mt-2">Susunan Dewan Pimpinan Harian Majelis Ulama Indonesia Provinsi DKI Jakarta.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {leaders.length > 0 ? leaders.map((person) => (
          <div key={person.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="h-64 overflow-hidden relative bg-slate-100 flex items-center justify-center">
              {person.image_url ? (
                <img src={person.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={person.name} />
              ) : (
                <UserCheck className="w-20 h-20 text-slate-300" />
              )}
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="bg-[#d1a64b] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {person.position_id}
                  </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">{person.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                {person.biography_id || 'Tokoh agama terkemuka yang memiliki dedikasi tinggi dalam dunia pendidikan dan dakwah Islamiyah di ibu kota.'}
              </p>
              {person.biography_id && (
                 <button className="text-emerald-600 font-bold text-sm hover:underline self-start mt-auto">Baca Biografi Lengkap &rarr;</button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-500">
             Belum ada data pimpinan yang dipublikasikan.
          </div>
        )}
      </div>
    </div>
  );
}
