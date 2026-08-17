-- Admin household editing needs to remove members, which the original RLS
-- migration didn't cover (only select/insert/update were added).
CREATE POLICY "household_members_delete_admin" ON public.household_members
    FOR DELETE
    TO authenticated
    USING (public.is_admin());
