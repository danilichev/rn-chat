export interface Pagination {
  limit: number;
  offset?: number;
}

export interface PaginationResult<T> extends Pagination {
  data: T[];
  total: number;
}
