import { handleError, json, readJson, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin, userId } = await requireAdmin(req);
    const body = await readJson(req);
    if (!body.id) return json(res, 400, { error: "Missing application id" });

    const { data, error } = await admin
      .from("applications")
      .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
      .eq("id", body.id)
      .is("deleted_at", null)
      .select("id, deleted_at")
      .single();

    if (error) throw error;
    json(res, 200, { application: data });
  } catch (error) {
    handleError(res, error);
  }
}
