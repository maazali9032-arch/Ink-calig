/**
 * The invitation is selected ONLY by the final non-empty pathname segment.
 * No query params, no hash, no storage, no defaults.
 */
export function resolveSlug(pathname: string): string | null {
  const segments = pathname.split("/").filter((s) => s.length > 0);
  const last = segments[segments.length - 1];
  if (!last) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(last);
  } catch {
    return null; // malformed percent encoding => not_found
  }

  decoded = decoded.trim();
  if (!decoded) return null;
  if (decoded.includes("/") || decoded.includes("\\")) return null;
  return decoded;
}
