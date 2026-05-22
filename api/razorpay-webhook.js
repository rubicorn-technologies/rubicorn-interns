import { createHmac } from "node:crypto";
import { env, handleError, json, supabaseAdmin } from "./_utils.js";

async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const rawBody = await readRaw(req);
    const signature = req.headers["x-razorpay-signature"];
    const expected = createHmac("sha256", env("RAZORPAY_WEBHOOK_SECRET"))
      .update(rawBody)
      .digest("hex");

    if (!signature || signature !== expected) {
      return json(res, 400, { error: "Invalid webhook signature" });
    }

    const event = JSON.parse(rawBody);
    const payment = event?.payload?.payment?.entity;
    const orderId = payment?.order_id;

    if (event.event === "payment.captured" && orderId) {
      const { error } = await supabaseAdmin()
        .from("applications")
        .update({
          payment_status: "paid",
          razorpay_payment_id: payment.id ?? null,
        })
        .eq("razorpay_order_id", orderId);
      if (error) throw new Error(error.message);
    }

    json(res, 200, { received: true });
  } catch (error) {
    handleError(res, error);
  }
}
