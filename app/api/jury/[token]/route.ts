import { NextRequest, NextResponse } from "next/server";
import { getJuryByToken, getCandidaturesForJury } from "@/lib/jury";

interface Params { params: Promise<{ token: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const jury = await getJuryByToken(token);
  if (!jury) {
    return NextResponse.json({ error: "INVALID_TOKEN", message: "Lien de notation invalide ou expiré." }, { status: 404 });
  }
  const candidatures = await getCandidaturesForJury(jury.id);
  return NextResponse.json({ jury: { id: jury.id, nom: jury.nom, etapes: jury.etapes }, candidatures });
}
