/**
 * Options for pagination calculation.
 */
export interface PaginationOptions {
  page?: number; // Current page number (1-based)
  limit?: number; // Number of items per page
}

/**
 * Result of pagination calculation, including query parameters and metadata.
 */
export interface PaginationResult {
  skip: number; // Number of items to skip for database queries
  take: number; // Number of items to take for database queries (same as limit)
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Standardized response structure for paginated API data.
 * This is also a common pagination-related interface, so it makes sense to keep it here.
 */
export interface PaginatedResponse<T> {
  data: T[]; // Array of the actual data items
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number; // The limit that was applied (same as 'take')
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
