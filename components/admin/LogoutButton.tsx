"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  return (
    <button
      onClick={logout}
      className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
    >
      Se déconnecter
    </button>
  );
}
