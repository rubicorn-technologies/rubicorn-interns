import { createClient } from "@supabase/supabase-js";

export function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function supabaseAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function supabaseUser(token) {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_PUBLISHABLE_KEY"), {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export async function requireAdmin(req) {
  const authHeader = req.headers.authorization ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.slice("Bearer ".length);
  const userClient = supabaseUser(token);
  const { data, error } = await userClient.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    const authError = new Error("Unauthorized");
    authError.statusCode = 401;
    throw authError;
  }

  const admin = supabaseAdmin();
  const { data: role } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", data.claims.sub)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) {
    const forbidden = new Error("Forbidden");
    forbidden.statusCode = 403;
    throw forbidden;
  }

  return { admin, userId: data.claims.sub };
}

export function handleError(res, error) {
  const status = error?.statusCode ?? 500;
  const message = error instanceof Error ? error.message : "Unexpected server error";
  console.error(error);
  json(res, status, { error: message });
}
