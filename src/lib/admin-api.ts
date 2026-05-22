import { supabase } from "@/integrations/supabase/client";

async function authHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) throw new Error("Unauthorized");
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function getAdminJson<T>(url: string): Promise<T | undefined> {
  const response = await fetch(url, { headers: await authHeaders() });
  if (response.status === 404) return undefined;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}

export async function postAdminJson<T>(url: string, payload: unknown): Promise<T | undefined> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });
  if (response.status === 404) return undefined;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}

export async function patchAdminJson<T>(url: string, payload: unknown): Promise<T | undefined> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });
  if (response.status === 404) return undefined;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}
