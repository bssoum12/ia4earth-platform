import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-leaf-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-display font-bold text-leaf-100 select-none mb-2">404</div>
          <h1 className="text-2xl font-display font-bold text-forest-900 mb-3">
            Page introuvable
          </h1>
          <p className="text-forest-700/70 mb-8">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </>
  );
}
