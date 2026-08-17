-- RLS for the visits module: profiles, households, household_members, visits.
--
-- Helper functions are SECURITY DEFINER so they can read public.profiles
-- without recursing back into profiles' own RLS policies.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND approved = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_approved_team_member()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'team_member' AND approved = true
    );
$$;

-- profiles ---------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "profiles_select_admin" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- households ---------------------------------------------------------------

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

CREATE POLICY "households_select_admin" ON public.households
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "households_insert_admin" ON public.households
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "households_update_admin" ON public.households
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "households_select_team_member" ON public.households
    FOR SELECT
    TO authenticated
    USING (
        public.is_approved_team_member()
        AND assigned_to = auth.uid()
    );

-- household_members ---------------------------------------------------------------
-- Visibility mirrors the parent household, reached via household_id.

ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "household_members_select_admin" ON public.household_members
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "household_members_insert_admin" ON public.household_members
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "household_members_update_admin" ON public.household_members
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "household_members_select_team_member" ON public.household_members
    FOR SELECT
    TO authenticated
    USING (
        public.is_approved_team_member()
        AND EXISTS (
            SELECT 1 FROM public.households h
            WHERE h.id = household_members.household_id
              AND h.assigned_to = auth.uid()
        )
    );

-- visits ---------------------------------------------------------------

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visits_select_admin" ON public.visits
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "visits_insert_admin" ON public.visits
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "visits_update_admin" ON public.visits
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "visits_select_team_member" ON public.visits
    FOR SELECT
    TO authenticated
    USING (
        public.is_approved_team_member()
        AND EXISTS (
            SELECT 1 FROM public.households h
            WHERE h.id = visits.household_id
              AND h.assigned_to = auth.uid()
        )
    );

CREATE POLICY "visits_insert_team_member" ON public.visits
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_approved_team_member()
        AND EXISTS (
            SELECT 1 FROM public.households h
            WHERE h.id = visits.household_id
              AND h.assigned_to = auth.uid()
        )
    );
