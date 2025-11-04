// Helper to read environment variables from window.__ENV__ (runtime) or import.meta.env (build-time)
function getEnv(key: string): string | undefined {
  // Check runtime environment variables first (injected by docker-entrypoint.sh)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    const value = (window as any).__ENV__[key];
    if (value && value !== '') {
      return value;
    }
  }
  // Fall back to build-time environment variables
  return (import.meta.env[key] as string | undefined);
}

export default getEnv;

