import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { isTodo } from "@/lib/todo";

type Ordered = "timeline" | "projects";

/** Entries sorted by `order`. Drafts only appear in `astro dev`. */
export async function getPublished<C extends Ordered>(name: C): Promise<CollectionEntry<C>[]> {
  const entries = (await getCollection(name)) as CollectionEntry<C>[];
  return entries
    .filter((entry) => import.meta.env.DEV || !entry.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

/**
 * The timeline entries Experience shows: never drafts (not even in dev), and only with a
 * known kind, title and summary. Skills links only to these, so its links always land.
 */
export async function getRenderedTimeline(): Promise<CollectionEntry<"timeline">[]> {
  const known = (field: Record<"en" | "da", string>) => !isTodo(field.en) || !isTodo(field.da);
  return (await getPublished("timeline")).filter(
    ({ data }) => !data.draft && !isTodo(data.kind) && known(data.title) && known(data.summary),
  );
}

export async function getProfile(): Promise<CollectionEntry<"profile">["data"]> {
  const entry = await getEntry("profile", "nassim");
  if (!entry) throw new Error('content/profile.yaml must contain an entry with id "nassim"');
  return entry.data;
}
