import { parseSort, type Sort } from './sort';
import { parsePagination, type Pagination } from './pagination';
import { parseFilter, type Filter } from './filter';

export interface ParsedQuery {
  sort: Sort;
  pagination: Pagination;
  filter: Filter;
}

/**
 * Parses a full ra-data-simple-rest `getList` query string into a structured object.
 * Accepts a `URLSearchParams` instance or a raw query string (with or without leading `?`).
 *
 * Expected parameters:
 *   - `sort`   — JSON array: `["field","ASC"|"DESC"]`
 *   - `range`  — JSON array: `[rangeStart, rangeEnd]`
 *   - `filter` — JSON object: `{"key": value, ...}`
 *
 * @throws if any required parameter is missing or malformed.
 */
export const parseQuery = (params: URLSearchParams | string): ParsedQuery => {
  const searchParams =
    typeof params === 'string'
      ? new URLSearchParams(params.startsWith('?') ? params.slice(1) : params)
      : params;

  const sortRaw = searchParams.get('sort');
  const rangeRaw = searchParams.get('range');
  const filterRaw = searchParams.get('filter');

  if (sortRaw === null) {
    throw new Error('Missing required query parameter: sort');
  }
  if (rangeRaw === null) {
    throw new Error('Missing required query parameter: range');
  }
  if (filterRaw === null) {
    throw new Error('Missing required query parameter: filter');
  }

  return {
    sort: parseSort(sortRaw),
    pagination: parsePagination(rangeRaw),
    filter: parseFilter(filterRaw),
  };
};
