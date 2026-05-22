import { createHmac } from "node:crypto";
import { z } from "zod";
import { env, handleError, json, readJson, supabaseAdmin } from "./_utils.js";

const VerifyInput = z.object({
  applicationId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const data = VerifyInput.parse(await readJson(req));
    const supabase = supabaseAdmin();
    const expected = createHmac("sha256", env("RAZORPAY_KEY_SECRET"))
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      await supabase
        .from("applications")
        .update({ payment_status: "failed" })
        .eq("id", data.applicationId);
      throw new Error("Payment signature verification failed");
    }

    const { data: updated, error } = await supabase
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

    json(res, 200, { intern_id: updated.intern_id, email: updated.email, name: updated.full_name });
  } catch (error) {
    handleError(res, error);
  }
}
