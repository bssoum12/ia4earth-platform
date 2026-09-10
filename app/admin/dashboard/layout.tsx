import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAdminSession } from "@/lib/admin-auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin");

  return (
    <div className="min-h-screen bg-[#F4FBEA] flex">
      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-[#163718] text-white flex flex-col fixed top-0 left-0 z-20">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[#8CC63F]" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <path d="M10 22 L16 10 L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18 h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-display font-bold text-sm">IA4EARTH Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 text-sm">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white">
            <span>📊</span> Vue d&apos;ensemble
          </Link>
          <Link href="/admin/dashboard/candidatures" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white">
            <span>📋</span> Candidatures
          </Link>
          <Link href="/admin/dashboard/jury" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white">
            <span>⚖️</span> Jury
          </Link>
        </nav>

        <div className="p-3 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
