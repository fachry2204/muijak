"use client";

export default function PimpinanPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-2 border-b-2 border-emerald-600 pb-4 inline-block">Profil Pimpinan</h2>
      <p className="text-slate-500 mb-8 mt-2">Susunan Dewan Pimpinan Harian Majelis Ulama Indonesia Provinsi DKI Jakarta.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
            <div className="h-64 overflow-hidden relative bg-slate-100">
              <img src={`https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Pimpinan" />
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="bg-[#d1a64b] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {i === 1 ? 'Ketua Umum' : i === 2 ? 'Sekretaris Umum' : 'Wakil Ketua'}
                  </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">KH. Nama Pimpinan, MA</h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                Tokoh agama terkemuka yang memiliki dedikasi tinggi dalam dunia pendidikan dan dakwah Islamiyah di ibu kota. Aktif dalam berbagai organisasi keislaman nasional.
              </p>
              <button className="text-emerald-600 font-bold text-sm mt-4 hover:underline">Baca Biografi Lengkap &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
