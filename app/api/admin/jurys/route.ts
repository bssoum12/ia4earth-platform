import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, createServiceClient } from "@/lib/admin-auth";
import { z } from "zod";

const jurySchema = z.object({
  nom:    z.string().min(2),
  email:  z.string().email(),
  etapes: z.array(z.enum(["preselection", "finale"])).min(1).default(["preselection"]),
});

export async function GET() {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("jury")
    .select("id, nom, email, etapes, lien_acces_unique, actif, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  return NextResponse.json({ jurys: data });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const parsed = jurySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("jury")
    .insert({ nom: parsed.data.nom, email: parsed.data.email, etapes: parsed.data.etapes })
    .select("id, nom, email, lien_acces_unique, etapes")
    .single();
  if (error) return NextResponse.json({ error: "DB_ERROR", detail: error.message }, { status: 500 });
  return NextResponse.json({ jury: data }, { status: 201 });
}
