import { getSupabase } from "./supabase";

export type Lifecycle = "live" | "fallback" | "not_found";

type Any = Record<string, unknown>;

export interface EventItem {
  name?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  note?: string | undefined;
  venue?: string | undefined;
}

export interface ContactItem {
  name?: string | undefined;
  phone?: string | undefined;
  whatsapp_url?: string | undefined;
  relation?: string | undefined;
}

export interface InvitationView {
  state: Lifecycle;
  brandName?: string | undefined;
  shop?: { name?: string | undefined; phone?: string | undefined; whatsapp?: string | undefined; address?: string | undefined; city?: string | undefined; business_contact?: string | undefined } | undefined;
  // live-only content
  invocation?: string | undefined;
  groomName?: string | undefined;
  brideName?: string | undefined;
  groomPhoto?: string | undefined;
  bridePhoto?: string | undefined;
  groomQualification?: string | undefined;
  brideQualification?: string | undefined;
  groomOccupation?: string | undefined;
  brideOccupation?: string | undefined;
  groomParents?: string | undefined;
  brideParents?: string | undefined;
  relatives?: string[] | undefined;
  weddingDate?: string | undefined;
  invitationMessage?: string | undefined;
  events: EventItem[];
  venueName?: string | undefined;
  venueAddress?: string | undefined;
  venueCity?: string | undefined;
  venueMapsUrl?: string | undefined;
  venueImage?: string | undefined;
  gallery: string[];
  musicEnabled: boolean;
  musicUrl?: string | undefined;
  contacts: ContactItem[];
  qrLabel?: string | undefined;
  publicUrl?: string | undefined;
  // fallback-only
  fallbackTitle?: string | undefined;
  fallbackMessage?: string | undefined;
  fallbackNote?: string | undefined;
}

function isObj(v: unknown): v is Any {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function unwrap(raw: unknown): Any {
  let value = raw;
  if (Array.isArray(value)) value = value[0];
  if (isObj(value) && isObj(value["data"]) && !("state" in value)) value = value["data"];
  return isObj(value) ? value : {};
}

function get(root: Any, path: string): unknown {
  let cur: unknown = root;
  for (const key of path.split(".")) {
    if (!isObj(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

function str(root: Any, ...paths: string[]): string | undefined {
  for (const p of paths) {
    const v = get(root, p);
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

function list(root: Any, ...paths: string[]): unknown[] {
  for (const p of paths) {
    const v = get(root, p);
    if (Array.isArray(v) && v.length) return v;
  }
  return [];
}

function strList(root: Any, ...paths: string[]): string[] {
  return list(root, ...paths)
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (isObj(item)) return str(item, "url", "image_url", "src", "name", "value") ?? "";
      return "";
    })
    .filter(Boolean);
}

function safeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return value;
  } catch { /* Ignore malformed and relative URLs from the RPC. */ }
  return undefined;
}

function normalizeState(raw: Any): Lifecycle {
  const s = str(raw, "state");
  if (s === "live" || s === "fallback" || s === "not_found") return s;
  return "not_found";
}

export function normalizeInvitation(raw: unknown): InvitationView {
  const root = unwrap(raw);
  const state = normalizeState(root);

  const shop = isObj(root["shop"]) ? root["shop"] : {};
  const brandName = str(shop, "name");

  const base: InvitationView = {
    state,
    brandName,
    events: [],
    gallery: [],
    musicEnabled: false,
    contacts: [],
  };

  if (state === "fallback") {
    return {
      ...base,
      shop: {
        name: str(shop, "name"), phone: str(shop, "phone"),
        whatsapp: safeUrl(str(shop, "whatsapp")), address: str(shop, "address"),
        city: str(shop, "city"), business_contact: str(shop, "business_contact"),
      },
    };
  }

  if (state !== "live") return base;

  const c = (isObj(root["content"]) ? root["content"] : {}) as Any;
  const inv = (isObj(root["invitation"]) ? root["invitation"] : {}) as Any;

  const events: EventItem[] = list(c, "events").filter(isObj).map((raw) => {
    const e = raw;
    return {
      name: str(e, "name", "title", "event_name"),
      date: str(e, "date", "event_date", "day"),
      time: str(e, "time", "event_time", "start_time"),
      note: str(e, "note", "description", "detail"),
      venue: str(e, "venue", "venue_name", "location"),
    };
  }).filter((e) => Boolean(e.name || e.date || e.time || e.note || e.venue));

  const contacts: ContactItem[] = list(c, "contacts").slice(0, 2).filter(isObj)
    .map((raw) => {
      const e = raw;
      return {
        name: str(e, "name"),
        phone: str(e, "phone"),
        whatsapp_url: safeUrl(str(e, "whatsapp_url")),
      };
    })
    .filter((x) => Boolean(x.phone));

  return {
    ...base,
    invocation: str(c, "invocation", "invocation_text", "bismillah"),
    groomName: str(c, "groom_name", "groom.name"),
    brideName: str(c, "bride_name", "bride.name"),
    groomPhoto: safeUrl(str(c, "groom_photo_url")),
    bridePhoto: safeUrl(str(c, "bride_photo_url")),
    groomQualification: str(c, "groom_qualification", "groom.qualification"),
    brideQualification: str(c, "bride_qualification", "bride.qualification"),
    groomOccupation: str(c, "groom_occupation", "groom.occupation"),
    brideOccupation: str(c, "bride_occupation", "bride.occupation"),
    groomParents: str(c, "groom_parents", "groom.parents", "groom_parents_text"),
    brideParents: str(c, "bride_parents", "bride.parents", "bride_parents_text"),
    relatives: strList(c, "relatives", "relatives_list"),
    weddingDate: str(c, "wedding_date", "date", "wedding_date_text"),
    invitationMessage: str(c, "invitation_message", "message", "invite_message"),
    events,
    venueName: str(c, "venue_name", "venue.name"),
    venueAddress: str(c, "venue_address", "venue.address"),
    venueCity: str(c, "venue_city", "venue.city"),
    venueMapsUrl: safeUrl(str(c, "maps_url")),
    venueImage: safeUrl(str(c, "venue_image_url")),
    gallery: strList(c, "gallery").map((url) => safeUrl(url)).filter((url): url is string => Boolean(url)),
    musicEnabled: get(c, "music_enabled") === true,
    musicUrl: safeUrl(str(c, "music_url")),
    contacts,
    qrLabel: str(c, "qr_text"),
    publicUrl: str(inv, "public_url"),
  };
}

export async function fetchInvitation(slug: string): Promise<InvitationView> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("get_public_invitation_content", {
    p_slug: slug,
  });
  if (error) throw new Error(error.message);
  return normalizeInvitation(data);
}
