export interface PaginationResponse<T> {
  data: T[];
  count: number;
  start: number;
  end: number;
}
