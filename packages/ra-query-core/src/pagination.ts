/**
 * Helper to represent pagination information
 * in a React Admin compliant manner
 */
export interface PaginationResponse<T> {
  data: T[];
  count: number;
  start: number;
  end: number;
}

export const makeContentRange = (name: string, pagination: PaginationResponse<unknown>): string => {
  return `${name} ${pagination.start}-${pagination.end}/${pagination.count}`;
};
