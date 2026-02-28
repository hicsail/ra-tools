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

/**
 * Create the content range header needed for React Admin
 * to determine how the response corresponds to the whole dataset
 */
export const makeContentRange = (name: string, pagination: PaginationResponse<unknown>): string => {
  return `${name} ${pagination.start}-${pagination.end}/${pagination.count}`;
};
