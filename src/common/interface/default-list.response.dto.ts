export interface DefaultListResponseDto<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
