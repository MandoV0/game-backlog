export interface PaginatedResult<T> {
    count: number;
    results: T[];
}