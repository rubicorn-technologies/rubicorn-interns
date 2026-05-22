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
    const { data: applications, error } = await supabaseAdmin
      .from("applications")
      .select("*, domains(name, slug)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const { data: domains, error: domainsError } = await supabaseAdmin
      .from("domains")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true });
    if (domainsError) throw new Error(domainsError.message);
    return { applications: applications ?? [], domains: domains ?? [] };
  });

export const updateApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        full_name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        college: z.string().min(1),
        degree: z.string().min(1),
        year_of_study: z.string().min(1),
        domain_id: z.string().uuid(),
        mode: z.enum(["online", "hybrid", "offline"]),
        payment_status: z.enum(["pending", "paid", "failed"]),
        amount_inr: z.number().int().min(0),
        intern_id: z.string().nullable(),
        linkedin_url: z.string().nullable(),
        github_url: z.string().nullable(),
        motivation: z.string().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...changes } = data;
    const { data: updated, error } = await supabaseAdmin
      .from("applications")
      .update(changes)
      .eq("id", id)
      .select("*, domains(name, slug)")
      .single();
    if (error) throw new Error(error.message);
    return { application: updated };
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: updated, error } = await supabaseAdmin
      .from("applications")
      .update({ deleted_at: new Date().toISOString(), deleted_by: context.userId })
      .eq("id", data.id)
      .is("deleted_at", null)
      .select("id, deleted_at")
      .single();
    if (error) throw new Error(error.message);
    return { application: updated };
  });

export const restoreApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: updated, error } = await supabaseAdmin
      .from("applications")
      .update({ deleted_at: null, deleted_by: null })
      .eq("id", data.id)
      .select("id, deleted_at")
      .single();
    if (error) throw new Error(error.message);
    return { application: updated };
  });

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: apps, error: appsError } = await supabaseAdmin
      .from("applications")
      .select("payment_status, amount_inr, domain_id, created_at, deleted_at, domains(name)");
    if (appsError) throw new Error(appsError.message);
    const activeApps = (apps ?? []).filter((app) => !app.deleted_at);
    const { data: domains, error: domainsError } = await supabaseAdmin
      .from("domains")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true });
    if (domainsError) throw new Error(domainsError.message);
    const totals = {
      total: activeApps.length,
      paid: activeApps.filter((a) => a.payment_status === "paid").length,
      pending: activeApps.filter((a) => a.payment_status === "pending").length,
      failed: activeApps.filter((a) => a.payment_status === "failed").length,
      revenue:
        activeApps
          .filter((a) => a.payment_status === "paid")
          .reduce((s, a) => s + (a.amount_inr || 0), 0) ?? 0,
    };
    const byDomainMap = new Map<
      string,
      { id: string; name: string; count: number; revenue: number }
    >();
    for (const d of domains ?? []) {
      byDomainMap.set(d.id, { id: d.id, name: d.name, count: 0, revenue: 0 });
    }
    for (const a of activeApps) {
      const name = (a.domains as { name?: string } | null)?.name ?? "Unknown";
      const id = a.domain_id ?? name;
      const e = byDomainMap.get(id) ?? { id, name, count: 0, revenue: 0 };
      e.count += 1;
      if (a.payment_status === "paid") e.revenue += a.amount_inr || 0;
      byDomainMap.set(id, e);
    }
    return { totals, byDomain: Array.from(byDomainMap.values()), applications: activeApps };
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
