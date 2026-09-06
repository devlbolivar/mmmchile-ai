export function resolveFollowupOrigin(env: Record<string, string | undefined>, requestOrigin: string | null): string {
  if (env.VERCEL_ENV === 'preview') {
    const allowed = [env.VERCEL_URL, env.VERCEL_BRANCH_URL]
      .filter((host): host is string => Boolean(host))
      .map(host => new URL(`https://${host}`).origin);
    // Keep the PKCE cookie on the exact host that initiated recovery.
    // Only Vercel-provided deployment/branch hosts are trusted, never arbitrary headers.
    if (!requestOrigin || !allowed.includes(requestOrigin)) {
      throw new Error('Abre el preview desde su URL de Vercel para recuperar tu contraseña.');
    }
    return requestOrigin;
  }
  const url = new URL(env.SEGUIMIENTO_APP_URL || 'https://mmmchile.cl');
  if (url.username || url.password || (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost'))) {
    throw new Error('La configuración de acceso no es válida.');
  }
  return url.origin;
}
