import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Rubicorn Technologies Pvt. Ltd. — industry-grade internships, training-first.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-semibold">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="/#programs" className="hover:text-foreground">Programs</a></li>
            <li><a href="/#process" className="hover:text-foreground">Process</a></li>
            <li><a href="/#faq" className="hover:text-foreground">FAQ</a></li>
            <li><a href="/#contact" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-semibold">Policies</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/refund" className="hover:text-foreground">Refund Policy</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-semibold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:admin@rubicorn.in" className="hover:text-foreground">admin@rubicorn.in</a></li>
            <li><a href="tel:+918978943122" className="hover:text-foreground">+91 89789 43122</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-center text-xs text-muted-foreground lg:px-8">
          © {new Date().getFullYear()} Rubicorn Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
