import { handleError, json, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    await requireAdmin(req);
    json(res, 200, { isAdmin: true });
  } catch (error) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return json(res, 200, { isAdmin: false });
    }
    handleError(res, error);
  }
}
