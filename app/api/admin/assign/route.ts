import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, createServiceClient } from "@/lib/admin-auth";
import { z } from "zod";

const assignSchema = z.object({
  jury_id:        z.string().uuid(),
  candidature_ids: z.array(z.string().uuid()).min(1),
  etape:          z.enum(["preselection", "finale"]).default("preselection"),
});

/** Assigne des candidatures à un juré en créant les lignes evaluations */
export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });

  const { jury_id, candidature_ids, etape } = parsed.data;
  const supabase = createServiceClient();

  const rows = candidature_ids.map((cid) => ({
    jury_id,
    candidature_id: cid,
    etape,
    statut: "en_cours" as const,
    conflit_interet: false,
    est_calibration: false,
  }));

  // upsert pour éviter les doublons (unique constraint sur candidature_id + jury_id + etape)
  const { data, error } = await supabase
    .from("evaluations")
    .upsert(rows, { onConflict: "candidature_id,jury_id,etape", ignoreDuplicates: true })
    .select("id");

  if (error) return NextResponse.json({ error: "DB_ERROR", detail: error.message }, { status: 500 });
  return NextResponse.json({ assigned: data?.length ?? 0 });
}
