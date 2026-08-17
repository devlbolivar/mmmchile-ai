-- Found during the chunk-8 access-control audit: the visit timeline embeds
-- visited_by:profiles(full_name), but a team_member has no SELECT policy
-- covering anyone else's profile row — so when an admin logs a visit on
-- their behalf, the embed silently comes back null instead of a name.
-- Scope is intentionally narrow: only profiles of people who have actually
-- logged a visit on one of the team_member's own assigned households.
CREATE POLICY "profiles_select_via_visits" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        public.is_approved_team_member()
        AND EXISTS (
            SELECT 1 FROM public.visits v
            JOIN public.households h ON h.id = v.household_id
            WHERE v.visited_by = profiles.id
              AND h.assigned_to = auth.uid()
        )
    );
