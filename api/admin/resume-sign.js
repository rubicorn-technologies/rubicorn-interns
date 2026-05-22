import { z } from "zod";
import { handleError, json, readJson, requireAdmin } from "../_utils.js";

const Input = z.object({ path: z.string().min(1) });

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const data = Input.parse(await readJson(req));
    const { data: signed, error } = await admin.storage
      .from("resumes")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);

    json(res, 200, { url: signed.signedUrl });
  } catch (error) {
    handleError(res, error);
  }
}
