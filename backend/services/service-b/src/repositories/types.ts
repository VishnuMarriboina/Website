export interface FindAllOptions<TFilter = Record<string, unknown>> {
  filter?: TFilter;
  page?:   number;
  limit?:  number;
  sort?:   Record<string, 1 | -1>;
}

export interface FindAllResult<T> {
  data:  T[];
  total: number;
}
