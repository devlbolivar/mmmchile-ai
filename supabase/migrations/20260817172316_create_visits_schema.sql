-- Visits module: profiles, households, household_members, visits.
-- profiles: extends auth.users with app-specific fields
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'team_member')), -- null until approved
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- households: the visit-worthy unit (family OR single person living alone)
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL, -- e.g. "Familia Pérez" or "María González"
    address TEXT,
    comuna TEXT,
    category TEXT NOT NULL CHECK (category IN ('new_visitor', 'new_believer', 'needs_visit')),
    source TEXT, -- how they connected: invited by whom, which event
    notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- household_members: people inside a household (just one row if living alone)
CREATE TABLE IF NOT EXISTS public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    is_primary_contact BOOLEAN NOT NULL DEFAULT false,
    phone TEXT,
    notes TEXT
);

-- visits: a log entry; member_id is nullable (null = whole household visited together)
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.household_members(id) ON DELETE SET NULL,
    visited_by UUID REFERENCES public.profiles(id),
    visit_date DATE NOT NULL,
    notes TEXT,
    follow_up_needed BOOLEAN NOT NULL DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
