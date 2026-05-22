import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("*, domains(name, slug)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { applications: data ?? [] };
  });

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: apps } = await supabaseAdmin
      .from("applications")
      .select("payment_status, amount_inr, domain_id, domains(name)");
    const totals = {
      total: apps?.length ?? 0,
      paid: apps?.filter((a) => a.payment_status === "paid").length ?? 0,
      pending: apps?.filter((a) => a.payment_status === "pending").length ?? 0,
      failed: apps?.filter((a) => a.payment_status === "failed").length ?? 0,
      revenue:
        apps
          ?.filter((a) => a.payment_status === "paid")
          .reduce((s, a) => s + (a.amount_inr || 0), 0) ?? 0,
    };
    const byDomainMap = new Map<string, { name: string; count: number; revenue: number }>();
    for (const a of apps ?? []) {
      const name = (a.domains as { name?: string } | null)?.name ?? "Unknown";
      const e = byDomainMap.get(name) ?? { name, count: 0, revenue: 0 };
      e.count += 1;
      if (a.payment_status === "paid") e.revenue += a.amount_inr || 0;
      byDomainMap.set(name, e);
    }
    return { totals, byDomain: Array.from(byDomainMap.values()) };
  });

export const signResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: signed, error } = await supabaseAdmin.storage
      .from("resumes")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });
