import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHmac } from "crypto";

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

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ApplicationInput.parse(d))
  .handler(async ({ data }) => {
    const { data: domain, error: domErr } = await supabaseAdmin
      .from("domains")
      .select("id, price_inr, name")
      .eq("slug", data.domain_slug)
      .eq("active", true)
      .maybeSingle();
    if (domErr || !domain) throw new Error("Selected domain not available");

    let resume_path: string | null = null;
    if (data.resume_base64 && data.resume_filename) {
      const buf = Buffer.from(data.resume_base64.split(",").pop() ?? "", "base64");
      const safe = data.resume_filename.replace(/[^\w.\-]/g, "_");
      const path = `applications/${crypto.randomUUID()}-${safe}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("resumes")
        .upload(path, buf, {
          contentType: "application/pdf",
          upsert: false,
        });
      if (upErr) console.error("Resume upload failed", upErr);
      else resume_path = path;
    }

    const { data: app, error: insErr } = await supabaseAdmin
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

    const keyId = process.env.RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
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
      const txt = await orderRes.text();
      console.error("Razorpay order failed", txt);
      throw new Error("Could not create payment order");
    }
    const order = (await orderRes.json()) as { id: string; amount: number };

    await supabaseAdmin
      .from("applications")
      .update({ razorpay_order_id: order.id })
      .eq("id", app.id);

    return {
      applicationId: app.id,
      orderId: order.id,
      amount: order.amount,
      keyId,
      domainName: domain.name,
    };
  });

const VerifyInput = z.object({
  applicationId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VerifyInput.parse(d))
  .handler(async ({ data }) => {
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== data.razorpay_signature) {
      await supabaseAdmin
        .from("applications")
        .update({ payment_status: "failed" })
        .eq("id", data.applicationId);
      throw new Error("Payment signature verification failed");
    }

    const { data: updated, error } = await supabaseAdmin
      .from("applications")
      .update({
        payment_status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("id", data.applicationId)
      .select("intern_id, full_name, email")
      .single();
    if (error || !updated) throw new Error("Failed to update application");

    return { intern_id: updated.intern_id, email: updated.email, name: updated.full_name };
  });
