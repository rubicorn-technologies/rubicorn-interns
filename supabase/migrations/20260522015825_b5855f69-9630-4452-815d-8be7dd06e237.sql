
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.internship_mode AS ENUM ('online', 'hybrid', 'offline');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- Profiles policies
CREATE POLICY "profiles self select" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "user_roles self select" ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Domains
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_inr INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "domains public read" ON public.domains FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "domains admin manage" ON public.domains FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER domains_updated_at BEFORE UPDATE ON public.domains
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  degree TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  domain_id UUID NOT NULL REFERENCES public.domains(id),
  mode internship_mode NOT NULL,
  linkedin_url TEXT,
  github_url TEXT,
  resume_path TEXT,
  motivation TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  amount_inr INTEGER NOT NULL DEFAULT 0,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert; only admins can read/update/delete
CREATE POLICY "applications anon insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications admin read" ON public.applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "applications admin update" ON public.applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "applications admin delete" ON public.applications FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_domain ON public.applications(domain_id);
CREATE INDEX idx_applications_status ON public.applications(payment_status);
CREATE INDEX idx_applications_order ON public.applications(razorpay_order_id);

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Intern ID generator
CREATE OR REPLACE FUNCTION public.generate_intern_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug TEXT;
  v_year TEXT;
  v_seq INTEGER;
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS DISTINCT FROM 'paid') AND NEW.intern_id IS NULL THEN
    SELECT UPPER(REPLACE(slug, '-', '')) INTO v_slug FROM public.domains WHERE id = NEW.domain_id;
    v_year := to_char(now(), 'YYYY');
    SELECT COUNT(*) + 1 INTO v_seq FROM public.applications
      WHERE domain_id = NEW.domain_id AND intern_id IS NOT NULL
      AND to_char(paid_at, 'YYYY') = v_year;
    NEW.intern_id := 'RBN-' || COALESCE(v_slug, 'GEN') || '-' || v_year || '-' || LPAD(v_seq::text, 4, '0');
    NEW.paid_at := COALESCE(NEW.paid_at, now());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER applications_intern_id BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.generate_intern_id();

-- Storage bucket for resumes (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "resumes anon upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "resumes admin read" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "resumes admin delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

-- Seed domains
INSERT INTO public.domains (slug, name, description, price_inr, sort_order) VALUES
  ('web-dev', 'Web Development', 'Full-stack web development with React, Node, and modern tooling.', 1, 1),
  ('python', 'Python Development', 'Python programming from fundamentals to backend APIs and automation.', 1, 2),
  ('ai-engineer', 'AI Engineer', 'Build production AI features with LLMs, vector search, and modern AI tooling.', 1, 3),
  ('prompt-engineer', 'Prompt Engineer', 'Design, evaluate, and ship high-quality prompts for real products.', 1, 4),
  ('data-science', 'Data Science', 'Python, SQL, Pandas, Power BI and end-to-end data projects.', 1, 5),
  ('cybersecurity', 'Cybersecurity', 'Hands-on Kali Linux, network security, and ethical hacking foundations.', 1, 6);
