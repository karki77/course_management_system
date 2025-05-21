import {
  PaginationOptions,
  PaginationResult,
  PaginatedResponse,
} from './types';

/**
 * Calculates pagination parameters for database queries and returns pagination metadata.
 * @param totalItems The total number of items available.
 * @param options Pagination options including page and limit.
 * @returns PaginationResult object.
 */
export function getPagination(
  totalItems: number,
  options: PaginationOptions,
): PaginationResult {
  const defaultPage = 1;
  const defaultLimit = 10;

  const page = Math.max(
    1,
    options.page ? parseInt(String(options.page), 10) : defaultPage,
  );
  const limit = Math.max(
    1,
    options.limit ? parseInt(String(options.limit), 10) : defaultLimit,
  );

  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(page, totalPages > 0 ? totalPages : 1);
  const skip = (currentPage - 1) * limit;
  const take = limit;

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    skip,
    take,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
  };
}

// If you were exporting PaginatedResponse from here previously, you can remove it
// or re-export it if you want the utility file to be the single point of import
// for all pagination related concerns.
// export type { PaginatedResponse }; // Example of re-exporting
