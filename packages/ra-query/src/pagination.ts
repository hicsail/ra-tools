export interface Pagination {
  page: number;
  perPage: number;
}

/**
 * Parses the `range` query parameter from ra-data-simple-rest into a page/perPage object.
 * Expected format: JSON-encoded `[rangeStart, rangeEnd]` array, e.g. `[0,24]`
 *
 * ra-data-simple-rest computes range as:
 *   rangeStart = (page - 1) * perPage
 *   rangeEnd   = page * perPage - 1
 *
 * So the inverse is:
 *   perPage = rangeEnd - rangeStart + 1
 *   page    = floor(rangeStart / perPage) + 1
 */
export const parsePagination = (value: string): Pagination => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`Invalid range parameter: expected JSON array, got "${value}"`);
  }

  if (!Array.isArray(parsed) || parsed.length !== 2) {
    throw new Error(`Invalid range parameter: expected [rangeStart, rangeEnd] array`);
  }

  const [rangeStart, rangeEnd] = parsed;

  if (typeof rangeStart !== 'number' || typeof rangeEnd !== 'number') {
    throw new Error(`Invalid range parameter: rangeStart and rangeEnd must be numbers`);
  }

  if (rangeStart < 0) {
    throw new Error(`Invalid range parameter: rangeStart must be >= 0`);
  }

  if (rangeEnd < rangeStart) {
    throw new Error(`Invalid range parameter: rangeEnd must be >= rangeStart`);
  }

  const perPage = rangeEnd - rangeStart + 1;
  const page = Math.floor(rangeStart / perPage) + 1;

  return { page, perPage };
};
