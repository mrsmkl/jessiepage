export function touchPage(page, now = Date.now()) {
  page.updatedAt = Math.max(Number(page.updatedAt) || 0, now) + 1;
  return page;
}

export function mergePages(localPages, storedPages) {
  const storedById = new Map((storedPages || []).map((page) => [page.id, page]));
  const merged = (localPages || []).map((page) => {
    const stored = storedById.get(page.id);
    storedById.delete(page.id);
    return stored && (Number(stored.updatedAt) || 0) > (Number(page.updatedAt) || 0) ? stored : page;
  });
  return [...merged, ...storedById.values()];
}

export function savedPixelSize(rawValue, minimum) {
  if (rawValue === null || rawValue === '') return null;
  const value = Number(rawValue);
  return Number.isFinite(value) && value >= minimum ? value : null;
}
