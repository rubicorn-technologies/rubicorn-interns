import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BlurOrbs } from "@/components/BlurOrbs";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Rubicorn" }, { name: "robots", content: "noindex" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/admin" });
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-5">
      <BlurOrbs />
      <form
        onSubmit={onSubmit}
        className="glass-strong relative w-full max-w-md rounded-2xl p-8 shadow-elevated"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Authorized personnel only</p>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              required
              className="mt-1.5 bg-white/5"
              defaultValue="admin@rubicorn.in"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" required className="mt-1.5 bg-white/5" />
          </div>
          <Button
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
