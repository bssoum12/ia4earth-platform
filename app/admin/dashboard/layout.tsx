import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { verifyAdminSession } from "@/lib/admin-auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin");

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(160deg, #F4F8F6 0%, #E5F4EF 100%)" }}>
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-forest-900 text-white flex flex-col fixed top-0 left-0 z-20 shadow-2xl">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-center">
            <Image
              src="/logo-salon.png"
              alt="Salon de l'Économie Verte"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse" />
            <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Interface Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 text-sm mt-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/75 hover:text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-none group-hover:bg-leaf-400/20 transition-colors">
              <svg className="w-4 h-4 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span>Vue d&apos;ensemble</span>
          </Link>

          <Link
            href="/admin/dashboard/candidatures"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/75 hover:text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-none group-hover:bg-leaf-400/20 transition-colors">
              <svg className="w-4 h-4 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Candidatures</span>
          </Link>

          <Link
            href="/admin/dashboard/jury"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/75 hover:text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-none group-hover:bg-leaf-400/20 transition-colors">
              <svg className="w-4 h-4 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span>Jury</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
