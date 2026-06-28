import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

const clientId = import.meta.env.WIX_CLIENT_ID ?? process.env.WIX_CLIENT_ID;

let client: ReturnType<typeof createClient> | null = null;

export function getWixClient() {
  if (!clientId) return null;
  if (!client) {
    client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId }),
    });
  }
  return client;
}

export interface CollectionFetchResult<T> {
  data: T[];
  source: "cms" | "static";
}

export async function fetchCollection<T>(
  dataCollectionId: string,
  fallback: T[],
  options: { sortField?: string; limit?: number } = {},
): Promise<CollectionFetchResult<T>> {
  const wix = getWixClient();
  if (!wix) {
    return { data: fallback, source: "static" };
  }
  try {
    let q = (wix as any).items.query(dataCollectionId);
    if (options.sortField) q = q.ascending(options.sortField);
    if (options.limit) q = q.limit(options.limit);
    const res = await q.find();
    if (!res?.items?.length) {
      return { data: fallback, source: "static" };
    }
    return { data: res.items as T[], source: "cms" };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[wix] read of "${dataCollectionId}" failed, using static fallback:`, err);
    }
    return { data: fallback, source: "static" };
  }
}

export async function insertItem(
  dataCollectionId: string,
  data: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const wix = getWixClient();
  if (!wix) return { ok: false, reason: "WIX_CLIENT_ID not configured" };
  try {
    await (wix as any).items.insert({
      dataCollectionId,
      dataItem: { data },
    });
    return { ok: true };
  } catch (err: any) {
    return { ok: false, reason: err?.message ?? String(err) };
  }
}
