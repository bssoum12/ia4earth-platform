export default function Loading() {
  return (
    <div className="min-h-screen bg-leaf-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-leaf-100 border-t-leaf-400 rounded-full animate-spin" />
        <span className="text-sm text-forest-700/60 font-medium">Chargement…</span>
      </div>
    </div>
  );
}
