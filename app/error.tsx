"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-leaf-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md surface-card">
        <div className="w-12 h-12 bg-earth-700/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-earth-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-bold text-forest-900 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-forest-700/70 text-sm mb-6">
          Nous avons rencontré un problème inattendu. Veuillez réessayer.
        </p>
        <button onClick={reset} className="btn-primary">
          Réessayer
        </button>
      </div>
    </main>
  );
}
