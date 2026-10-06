import { getCollection, getEntry, type CollectionEntry } from "astro:content";

type Ordered = "timeline" | "projects";

/** Entries sorted by `order`. Drafts only appear in `astro dev`. */
export async function getPublished<C extends Ordered>(name: C): Promise<CollectionEntry<C>[]> {
  const entries = (await getCollection(name)) as CollectionEntry<C>[];
  return entries
    .filter((entry) => import.meta.env.DEV || !entry.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getProfile(): Promise<CollectionEntry<"profile">["data"]> {
  const entry = await getEntry("profile", "nassim");
  if (!entry) throw new Error('content/profile.yaml must contain an entry with id "nassim"');
  return entry.data;
}
