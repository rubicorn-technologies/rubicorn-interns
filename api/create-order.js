import { z } from "zod";
import { randomUUID } from "node:crypto";
import { handleError, json, readJson, supabaseAdmin, env } from "./_utils.js";

const ApplicationInput = z.object({
  full_name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(20),
  college: z.string().min(1).max(200),
  degree: z.string().min(1).max(120),
  year_of_study: z.string().min(1).max(40),
  domain_slug: z.string().min(1).max(60),
  mode: z.enum(["online", "hybrid", "offline"]),
  linkedin_url: z.string().url().max(300).optional().or(z.literal("")),
  github_url: z.string().url().max(300).optional().or(z.literal("")),
  motivation: z.string().max(2000).optional().or(z.literal("")),
  resume_base64: z.string().max(8_000_000).optional(),
  resume_filename: z.string().max(200).optional(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const data = ApplicationInput.parse(await readJson(req));
    const supabase = supabaseAdmin();

    const { data: domain, error: domErr } = await supabase
      .from("domains")
      .select("id, price_inr, name")
      .eq("slug", data.domain_slug)
      .eq("active", true)
      .maybeSingle();
    if (domErr || !domain) throw new Error("Selected domain not available");

    let resume_path = null;
    if (data.resume_base64 && data.resume_filename) {
      const buf = Buffer.from(data.resume_base64.split(",").pop() ?? "", "base64");
      const safe = data.resume_filename.replace(/[^\w.-]/g, "_");
      const path = `applications/${randomUUID()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("resumes").upload(path, buf, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (upErr) console.error("Resume upload failed", upErr);
      else resume_path = path;
    }

    const { data: app, error: insErr } = await supabase
      .from("applications")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        college: data.college,
        degree: data.degree,
        year_of_study: data.year_of_study,
        domain_id: domain.id,
        mode: data.mode,
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        motivation: data.motivation || null,
        resume_path,
        amount_inr: domain.price_inr,
        payment_status: "pending",
      })
      .select("id")
      .single();
    if (insErr || !app) throw new Error("Could not save application");

    const keyId = env("RAZORPAY_KEY_ID");
    const keySecret = env("RAZORPAY_KEY_SECRET");
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: domain.price_inr * 100,
        currency: "INR",
        receipt: app.id,
        notes: { application_id: app.id, domain: domain.name },
      }),
    });

    if (!orderRes.ok) {
      console.error("Razorpay order failed", await orderRes.text());
      throw new Error("Could not create payment order");
    }

    const order = await orderRes.json();
    await supabase.from("applications").update({ razorpay_order_id: order.id }).eq("id", app.id);

    json(res, 200, {
      applicationId: app.id,
      orderId: order.id,
      amount: order.amount,
      keyId,
      domainName: domain.name,
    });
  } catch (error) {
    handleError(res, error);
  }
}
