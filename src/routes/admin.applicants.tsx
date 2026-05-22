import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listApplications, signResume } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/applicants")({
  component: Applicants,
  head: () => ({ meta: [{ title: "Applicants — Rubicorn Admin" }, { name: "robots", content: "noindex" }] }),
});

type App = {
  id: string;
  intern_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  mode: string;
  payment_status: string;
  amount_inr: number;
  created_at: string;
  resume_path: string | null;
  domains: { name: string } | null;
};

function Applicants() {
  const list = useServerFn(listApplications);
  const sign = useServerFn(signResume);
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["apps"], queryFn: () => list() });
  const rows = ((data?.applications as App[] | undefined) ?? []).filter((a) => {
    const s = q.toLowerCase();
    return !s || a.full_name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s) || (a.intern_id ?? "").toLowerCase().includes(s);
  });

  function exportCsv() {
    const headers = ["Intern ID", "Name", "Email", "Phone", "Domain", "College", "Mode", "Status", "Amount", "Date"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [r.intern_id ?? "", r.full_name, r.email, r.phone, r.domains?.name ?? "", r.college, r.mode, r.payment_status, r.amount_inr, r.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Applicants</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} record{rows.length !== 1 && "s"}</p>
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          />
          <Button onClick={exportCsv} variant="outline" className="border-white/10">
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="glass mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Intern ID", "Name", "Domain", "College", "Mode", "Status", "Date", "Resume"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-muted-foreground" colSpan={8}>Loading…</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{r.intern_id ?? "—"}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{r.full_name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </td>
                <td className="px-4 py-3">{r.domains?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.college}</td>
                <td className="px-4 py-3 capitalize">{r.mode}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.payment_status === "paid" ? "bg-primary/20 text-primary" :
                    r.payment_status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-red-500/20 text-red-300"
                  }`}>{r.payment_status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {r.resume_path ? (
                    <button
                      onClick={async () => {
                        const { url } = await sign({ data: { path: r.resume_path! } });
                        window.open(url, "_blank");
                      }}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" /> View
                    </button>
                  ) : "—"}
                </td>
              </tr>
            ))}
            {!isLoading && !rows.length && <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={8}>No applicants yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
