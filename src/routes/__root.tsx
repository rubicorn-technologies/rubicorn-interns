import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rubicorn Internships — Industry-grade internships in India" },
      {
        name: "description",
        content:
          "Apply for AICTE-recognized internships at Rubicorn Technologies. Online, Hybrid, Offline modes. Real projects, mentor support, LOR & certificates.",
      },
      {
        name: "keywords",
        content:
          "internship India, online internship, AI internship, web development internship, data science internship, Rubicorn",
      },
      { name: "author", content: "Rubicorn Technologies Pvt. Ltd." },
      {
        property: "og:title",
        content: "Rubicorn Internships — Industry-grade internships in India",
      },
      {
        property: "og:description",
        content:
          "Apply for AICTE-recognized internships at Rubicorn Technologies. Online, Hybrid, Offline modes. Real projects, mentor support, LOR & certificates.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Rubicorn Internships" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Rubicorn Internships — Industry-grade internships in India",
      },
      {
        name: "twitter:description",
        content:
          "Apply for AICTE-recognized internships at Rubicorn Technologies. Online, Hybrid, Offline modes. Real projects, mentor support, LOR & certificates.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4eed9950-a9c9-4a85-92ef-9d5dbf16a4e4/id-preview-61aa7fc0--3dc91a37-ff1a-43d3-9e64-e4bc472f32fe.lovable.app-1779415567625.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4eed9950-a9c9-4a85-92ef-9d5dbf16a4e4/id-preview-61aa7fc0--3dc91a37-ff1a-43d3-9e64-e4bc472f32fe.lovable.app-1779415567625.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Rubicorn Technologies Pvt. Ltd.",
          url: "https://intern.rubicorn.in",
          email: "admin@rubicorn.in",
          telephone: "+91-89789-43122",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
