import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { createOrder, verifyPayment } from "@/lib/payments.functions";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DOMAINS = [
  { slug: "web-dev", name: "Web Development" },
  { slug: "python", name: "Python Development" },
  { slug: "ai-engineer", name: "AI Engineer" },
  { slug: "prompt-engineer", name: "Prompt Engineer" },
  { slug: "data-science", name: "Data Science" },
  { slug: "cybersecurity", name: "Cybersecurity" },
];

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function useRazorpayScript() {
  useEffect(() => {
    if (document.getElementById("razorpay-sdk")) return;
    const s = document.createElement("script");
    s.id = "razorpay-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

export function ApplyModal({
  open,
  onOpenChange,
  presetDomain,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  presetDomain?: string;
}) {
  const navigate = useNavigate();
  useRazorpayScript();
  const create = useServerFn(createOrder);
  const verify = useServerFn(verifyPayment);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState<string>(presetDomain || "web-dev");
  const [mode, setMode] = useState<"online" | "hybrid" | "offline">("online");
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    if (presetDomain) setDomain(presetDomain);
  }, [presetDomain]);

  async function fileToBase64(f: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onerror = () => rej(r.error);
      r.onload = () => res(r.result as string);
      r.readAsDataURL(f);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      let resume_base64: string | undefined;
      let resume_filename: string | undefined;
      if (resume) {
        if (resume.size > 5 * 1024 * 1024) throw new Error("Resume must be < 5MB");
        resume_base64 = await fileToBase64(resume);
        resume_filename = resume.name;
      }
      const payload = {
        full_name: String(fd.get("full_name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        college: String(fd.get("college") || ""),
        degree: String(fd.get("degree") || ""),
        year_of_study: String(fd.get("year_of_study") || ""),
        domain_slug: domain,
        mode,
        linkedin_url: String(fd.get("linkedin_url") || ""),
        github_url: String(fd.get("github_url") || ""),
        motivation: String(fd.get("motivation") || ""),
        resume_base64,
        resume_filename,
      };
      const order = await create({ data: payload });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "Rubicorn Technologies",
        description: `${order.domainName} — Industry Training`,
        order_id: order.orderId,
        prefill: { name: payload.full_name, email: payload.email, contact: payload.phone },
        theme: { color: "#1cb5c9" },
        handler: async (resp: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const result = await verify({
              data: {
                applicationId: order.applicationId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            onOpenChange(false);
            navigate({ to: "/success", search: { id: result.intern_id || "" } });
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
            console.error(err);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[92vh] max-w-2xl overflow-y-auto border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Apply for an Internship</DialogTitle>
          <DialogDescription>
            Fill in your details. Internship participation is free — payment is for the industry training.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-2 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="full_name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" required />
            <Field label="College" name="college" required />
            <Field label="Degree / Branch" name="degree" required />
            <Field label="Year of Study" name="year_of_study" placeholder="e.g. 3rd year" required />
            <div>
              <Label>Domain</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="mt-1.5 bg-white/5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "online" | "hybrid" | "offline")}>
                <SelectTrigger className="mt-1.5 bg-white/5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field label="LinkedIn URL" name="linkedin_url" type="url" placeholder="https://" />
            <Field label="GitHub URL" name="github_url" type="url" placeholder="https://" />
          </div>

          <div>
            <Label>Resume (PDF, max 5MB)</Label>
            <Input
              type="file"
              accept=".pdf"
              className="mt-1.5 bg-white/5"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label>Why do you want to join?</Label>
            <Textarea name="motivation" className="mt-1.5 min-h-24 bg-white/5" />
          </div>

          <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
            I understand this is a training-based internship program where training is paid and internship
            participation is free.
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-primary">*</span>}</Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} className="mt-1.5 bg-white/5" />
    </div>
  );
}
