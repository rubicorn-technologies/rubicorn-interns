import logo from "@/assets/rubicorn-logo.jpg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logo}
        alt="Rubicorn Technologies"
        className="h-9 w-9 rounded-lg ring-1 ring-white/10"
        loading="eager"
      />
      <span className="font-display text-lg font-semibold tracking-tight">
        Rubicorn<span className="text-primary"> Interns</span>
      </span>
    </span>
  );
}
