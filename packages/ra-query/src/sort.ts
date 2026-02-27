export type SortOrder = 'ASC' | 'DESC';

export interface Sort {
  field: string;
  order: SortOrder;
}

/**
 * Parses the `sort` query parameter from ra-data-simple-rest.
 * Expected format: JSON-encoded `[field, order]` array, e.g. `["title","ASC"]`
 */
export const parseSort = (value: string): Sort => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`Invalid sort parameter: expected JSON array, got "${value}"`);
  }

  if (!Array.isArray(parsed) || parsed.length !== 2) {
    throw new Error(`Invalid sort parameter: expected [field, order] array`);
  }

  const [field, order] = parsed;

  if (typeof field !== 'string') {
    throw new Error(`Invalid sort parameter: field must be a string`);
  }

  if (order !== 'ASC' && order !== 'DESC') {
    throw new Error(`Invalid sort parameter: order must be "ASC" or "DESC", got "${order}"`);
  }

  return { field, order };
};
