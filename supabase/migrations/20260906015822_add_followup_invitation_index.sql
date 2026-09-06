create index ac_invitations_invited_by
  on public.ac_invitations (invited_by)
  where invited_by is not null;
