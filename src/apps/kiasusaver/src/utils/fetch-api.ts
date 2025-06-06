import { server$ } from "@builder.io/qwik-city";

/**
 * Server-side API fetch utility for Qwik SSR routes/loaders.
 * Accepts a relative path (e.g. /api/packages) or absolute URL.
 * In the future, set process.env.API_BASE_URL to point to a remote worker.
 */
export const fetchFromApiServer$ = server$(async function <T>(this: any, path: string): Promise<T> {
  let url: string;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    url = path;
  } else {
    // Use the request's origin for SSR fetches
    const origin = this.request?.url ? new URL(this.request.url).origin : "";
    url = origin + path;
  }
  const res = await fetch(url, { headers: { "x-ssr": "1" } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
});
