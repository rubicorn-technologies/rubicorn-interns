import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, FileText, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteApplication,
  listApplications,
  restoreApplication,
  signResume,
  updateApplication,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminJson, patchAdminJson, postAdminJson } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/applicants")({
  component: Applicants,
  head: () => ({
    meta: [{ title: "Applicants - Rubicorn Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type Domain = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type App = {
  id: string;
  intern_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  year_of_study: string;
  domain_id: string;
  mode: "online" | "hybrid" | "offline";
  payment_status: "pending" | "paid" | "failed";
  amount_inr: number;
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_at: string;
  paid_at: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  motivation: string | null;
  resume_path: string | null;
  domains: { name: string; slug: string } | null;
};

type EditForm = Pick<
  App,
  | "id"
  | "full_name"
  | "email"
  | "phone"
  | "college"
  | "degree"
  | "year_of_study"
  | "domain_id"
  | "mode"
  | "payment_status"
  | "amount_inr"
  | "intern_id"
  | "linkedin_url"
  | "github_url"
  | "motivation"
>;

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toEditForm(app: App): EditForm {
  return {
    id: app.id,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    college: app.college,
    degree: app.degree,
    year_of_study: app.year_of_study,
    domain_id: app.domain_id,
    mode: app.mode,
    payment_status: app.payment_status,
    amount_inr: app.amount_inr,
    intern_id: app.intern_id,
    linkedin_url: app.linkedin_url,
    github_url: app.github_url,
    motivation: app.motivation,
  };
}

function Applicants() {
  const list = useServerFn(listApplications);
  const sign = useServerFn(signResume);
  const update = useServerFn(updateApplication);
  const remove = useServerFn(deleteApplication);
  const restore = useServerFn(restoreApplication);
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [domainId, setDomainId] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [section, setSection] = useState<"active" | "deleted">("active");
  const [editing, setEditing] = useState<EditForm | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: async () =>
      (await getAdminJson<Awaited<ReturnType<typeof list>>>("/api/admin/applications")) ?? list(),
  });

  const apps = ((data?.applications as App[] | undefined) ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const domains = useMemo(() => (data?.domains as Domain[] | undefined) ?? [], [data?.domains]);
  const domainById = useMemo(
    () => new Map(domains.map((domain) => [domain.id, domain])),
    [domains],
  );
  const domainName = (app: App) => app.domains?.name ?? domainById.get(app.domain_id)?.name ?? "-";

  const rows = useMemo(() => {
    const search = q.toLowerCase();
    const start = from ? new Date(`${from}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
    const end = to ? new Date(`${to}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;
    return apps.filter((app) => {
      const created = new Date(app.created_at).getTime();
      const searchable = [
        app.full_name,
        app.email,
        app.phone,
        app.college,
        app.intern_id ?? "",
        app.domains?.name ?? domainById.get(app.domain_id)?.name ?? "-",
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!search || searchable.includes(search)) &&
        (section === "deleted" ? !!app.deleted_at : !app.deleted_at) &&
        (domainId === "all" || app.domain_id === domainId) &&
        created >= start &&
        created <= end
      );
    });
  }, [apps, domainById, domainId, from, q, section, to]);

  const mutation = useMutation({
    mutationFn: async (payload: EditForm) => {
      const normalized = {
        ...payload,
        amount_inr: Number(payload.amount_inr) || 0,
        intern_id: payload.intern_id || null,
        linkedin_url: payload.linkedin_url || null,
        github_url: payload.github_url || null,
        motivation: payload.motivation || null,
      };
      return (
        (await patchAdminJson<{ application: App }>("/api/admin/application", normalized)) ??
        (await update({ data: normalized }))
      );
    },
    onSuccess: () => {
      toast.success("Application updated");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await postAdminJson<{ application: Pick<App, "id" | "deleted_at"> }>(
        "/api/admin/application-delete",
        { id },
      )) ?? (await remove({ data: { id } })),
    onSuccess: () => {
      toast.success("Application moved to Deleted");
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed"),
  });
  const restoreMutation = useMutation({
    mutationFn: async (id: string) =>
      (await postAdminJson<{ application: Pick<App, "id" | "deleted_at"> }>(
        "/api/admin/application-restore",
        { id },
      )) ?? (await restore({ data: { id } })),
    onSuccess: () => {
      toast.success("Application restored");
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Restore failed"),
  });

  function exportCsv() {
    const headers = [
      "Intern ID",
      "Name",
      "Email",
      "Phone",
      "Domain",
      "College",
      "Degree",
      "Year",
      "Mode",
      "Status",
      "Amount",
      "Applied At",
      "Paid At",
      "Updated At",
      "Deleted At",
    ];
    const lines = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.intern_id ?? "",
          row.full_name,
          row.email,
          row.phone,
          domainName(row),
          row.college,
          row.degree,
          row.year_of_study,
          row.mode,
          row.payment_status,
          row.amount_inr,
          row.created_at,
          row.paid_at ?? "",
          row.updated_at,
          row.deleted_at ?? "",
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Applicants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {section} record{rows.length !== 1 && "s"} shown
          </p>
        </div>
        <div className="grid w-full gap-2 xl:w-auto xl:grid-cols-[140px_180px_190px_145px_145px_auto]">
          <Select
            value={section}
            onValueChange={(value: "active" | "deleted") => setSection(value)}
          >
            <SelectTrigger className="border-white/10 bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search..."
            className="border-white/10 bg-white/5"
          />
          <Select value={domainId} onValueChange={setDomainId}>
            <SelectTrigger className="border-white/10 bg-white/5">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.id}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="border-white/10 bg-white/5"
            aria-label="From date"
          />
          <Input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="border-white/10 bg-white/5"
            aria-label="To date"
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
              {[
                "Intern ID",
                "Name",
                "Domain",
                "College",
                "Mode",
                "Status",
                "Applied",
                section === "deleted" ? "Deleted" : "Updated",
                "Resume",
                "Edit",
                section === "deleted" ? "Restore" : "Delete",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={11}>
                  Loading...
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{row.intern_id ?? "-"}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{row.full_name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                  <p className="text-xs text-muted-foreground">{row.phone}</p>
                </td>
                <td className="px-4 py-3">{domainName(row)}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.college}</td>
                <td className="px-4 py-3 capitalize">{row.mode}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.payment_status === "paid"
                        ? "bg-primary/20 text-primary"
                        : row.payment_status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {row.payment_status}
                  </span>
                  {row.paid_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(row.paid_at)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatDateTime(row.created_at)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {section === "deleted"
                    ? formatDateTime(row.deleted_at)
                    : formatDateTime(row.updated_at)}
                </td>
                <td className="px-4 py-3">
                  {row.resume_path ? (
                    <button
                      onClick={async () => {
                        const payload = { path: row.resume_path! };
                        const { url } =
                          (await postAdminJson<{ url: string }>(
                            "/api/admin/resume-sign",
                            payload,
                          )) ?? (await sign({ data: payload }));
                        window.open(url, "_blank");
                      }}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" /> View
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  {section === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                      onClick={() => setEditing(toEditForm(row))}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  {section === "deleted" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                      disabled={restoreMutation.isPending}
                      onClick={() => restoreMutation.mutate(row.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-red-300 hover:text-red-200"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm("Move this application to Deleted?")) {
                          deleteMutation.mutate(row.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && !rows.length && (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={11}>
                  No applicants in this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Applicant</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                mutation.mutate(editing);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={editing.full_name}
                  onChange={(full_name) => setEditing({ ...editing, full_name })}
                />
                <Field
                  label="Email"
                  type="email"
                  value={editing.email}
                  onChange={(email) => setEditing({ ...editing, email })}
                />
                <Field
                  label="Phone"
                  value={editing.phone}
                  onChange={(phone) => setEditing({ ...editing, phone })}
                />
                <Field
                  label="College"
                  value={editing.college}
                  onChange={(college) => setEditing({ ...editing, college })}
                />
                <Field
                  label="Degree"
                  value={editing.degree}
                  onChange={(degree) => setEditing({ ...editing, degree })}
                />
                <Field
                  label="Year"
                  value={editing.year_of_study}
                  onChange={(year_of_study) => setEditing({ ...editing, year_of_study })}
                />
                <Field
                  label="Intern ID"
                  value={editing.intern_id ?? ""}
                  onChange={(intern_id) => setEditing({ ...editing, intern_id })}
                />
                <Field
                  label="Amount"
                  type="number"
                  value={String(editing.amount_inr)}
                  onChange={(amount) => setEditing({ ...editing, amount_inr: Number(amount) || 0 })}
                />
                <div>
                  <Label>Domain</Label>
                  <Select
                    value={editing.domain_id}
                    onValueChange={(domain_id) => setEditing({ ...editing, domain_id })}
                  >
                    <SelectTrigger className="mt-1.5 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select
                    value={editing.mode}
                    onValueChange={(mode: App["mode"]) => setEditing({ ...editing, mode })}
                  >
                    <SelectTrigger className="mt-1.5 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editing.payment_status}
                    onValueChange={(payment_status: App["payment_status"]) =>
                      setEditing({ ...editing, payment_status })
                    }
                  >
                    <SelectTrigger className="mt-1.5 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field
                  label="LinkedIn"
                  value={editing.linkedin_url ?? ""}
                  onChange={(linkedin_url) => setEditing({ ...editing, linkedin_url })}
                />
                <Field
                  label="GitHub"
                  value={editing.github_url ?? ""}
                  onChange={(github_url) => setEditing({ ...editing, github_url })}
                />
              </div>
              <div>
                <Label>Motivation</Label>
                <Textarea
                  className="mt-1.5 border-white/10 bg-white/5"
                  value={editing.motivation ?? ""}
                  onChange={(event) => setEditing({ ...editing, motivation: event.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 border-white/10 bg-white/5"
      />
    </div>
  );
}
