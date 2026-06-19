"use client";

export default function SejarahPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-6 border-b-2 border-emerald-600 pb-4 inline-block">Sejarah Majelis Ulama Indonesia</h2>
      <div className="prose prose-lg prose-emerald max-w-none">
        <p>Majelis Ulama Indonesia (MUI) adalah wadah musyawarah para ulama, zuama, dan cendekiawan muslim dalam mengayomi umat dan mengembangkan kehidupan yang Islami serta meningkatkan partisipasi umat Islam dalam pembangunan nasional.</p>
        <p>MUI Provinsi DKI Jakarta didirikan tidak lama setelah berdirinya MUI Pusat pada tanggal 26 Juli 1975 di Jakarta. Peran strategis ibu kota menjadikan MUI DKI Jakarta memiliki tanggung jawab yang sangat sentral dalam menjaga kondusivitas, keharmonisan umat beragama, serta menjadi pionir dalam melahirkan fatwa-fatwa dan program sosial kemasyarakatan yang adaptif.</p>
        <img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop" className="w-full rounded-xl my-8 shadow-md" alt="Sejarah" />
        <h3>Peran Sentral di Ibu Kota</h3>
        <p>Seiring berjalannya waktu, MUI DKI Jakarta terus merevitalisasi perannya. Tidak sekadar memberi fatwa, MUI turut aktif dalam pendidikan kader ulama, perlindungan konsumen melalui sertifikasi halal, advokasi kemanusiaan, hingga resolusi konflik antarumat.</p>
      </div>
    </div>
  );
}
