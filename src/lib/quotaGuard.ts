/**
 * Client-side defenses installed once at startup.
 *
 * - Ignores errors injected by browser extensions (chrome-extension:// scripts) so they
 *   do not surface as app errors.
 * - Turns Google Maps quota/auth failures into a `gmp-quota-exceeded` window event, which
 *   App listens for to show a fallback banner and switch to the Leaflet map.
 *
 * `console.error` is wrapped (not replaced): the original is always called first, so no
 * error is hidden from the developer console.
 */
export const QUOTA_EVENT = 'gmp-quota-exceeded';

export function installClientGuards(): void {
  window.addEventListener('error', (event) => {
    if (event.filename?.startsWith('chrome-extension://')) event.preventDefault();
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && String(event.reason).includes('chrome-extension://')) event.preventDefault();
  });

  // Google Maps calls this global when the API key fails (invalid key, quota, referrer).
  (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
    window.dispatchEvent(new CustomEvent(QUOTA_EVENT));
  };

  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    originalError.apply(console, args);
    const msg = args.map((a) => String(a)).join(' ');
    if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
      window.dispatchEvent(new CustomEvent(QUOTA_EVENT));
    }
  };
}
