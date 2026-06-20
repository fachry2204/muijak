import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ReactNode } from 'react';
import pool from '@/lib/db';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { getSession } from '@/lib/auth';
import { PageContentProvider } from '@/components/providers/PageContentProvider';

export default async function PublicLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const session = await getSession();
  
  // Fetch dynamic menus from database
  let dbMenus: any[] = [];
  try {
    const [rows]: any = await pool.query('SELECT * FROM menus ORDER BY parent_id ASC, order_index ASC');
    dbMenus = rows;
  } catch (error) {
    console.error("Failed to load menus in layout");
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen relative overflow-x-hidden">
      {/* Global Islamic Pattern Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url(/gambar/patternbg.png)] bg-repeat z-0" style={{ backgroundSize: '300px' }}></div>
      
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <PageContentProvider session={session}>
          <Navbar locale={locale} dynamicMenus={dbMenus} session={session} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <LanguageSwitcher />
        </PageContentProvider>
      </div>
    </div>
  );
}
