export interface PaginationQuery {
  page?:  string | number;
  limit?: string | number;
  [key: string]: unknown;
}

export interface ParsedPagination {
  page:  number;
  limit: number;
  skip:  number;
}

export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(body: Record<string, unknown>): MinimalResponse;
  send(body?: string): void;
}
