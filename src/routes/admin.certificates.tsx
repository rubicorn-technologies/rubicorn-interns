import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({ meta: [{ title: "Certificates — Rubicorn Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <h1 className="font-display text-3xl font-bold">Certificates</h1>
      <p className="mt-2 text-sm text-muted-foreground">Bulk certificate generation will live here.</p>
    </div>
  ),
});
