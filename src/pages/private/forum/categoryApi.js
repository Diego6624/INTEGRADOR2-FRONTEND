import apiFetch from "@/lib/apiClient";

export const normalizeCategory = value => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("es");

export async function fetchCategories() {
  const tags = [];
  for (let page = 0; ; page += 1) {
    const { data } = await apiFetch.get("/tag", { params: { page, size: 100, sort: "name,asc" } });
    const items = data.content ?? [];
    tags.push(...items);
    if (data.last === true || !items.length || page + 1 >= (data.totalPages ?? 1)) return tags;
  }
}

export async function createCategory(value) {
  const name = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (!name) throw new Error("Escribe el nombre de la categoría.");
  const tags = await fetchCategories();
  const existing = tags.find(tag => normalizeCategory(tag.name) === normalizeCategory(name));
  if (existing) return existing;
  try {
    const { data } = await apiFetch.post("/tag", { name });
    return data;
  } catch (error) {
    // Another client may have created it after our check.
    const refreshed = await fetchCategories();
    const concurrent = refreshed.find(tag => normalizeCategory(tag.name) === normalizeCategory(name));
    if (concurrent) return concurrent;
    throw error;
  }
}
