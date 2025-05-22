import { PageDocsResult } from './types';
import { paginationDto } from './validation';
import { ZodError } from 'zod';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

/**
 * Format Zod validation errors into user-friendly messages
 */
function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    // Extract just the messages from the errors and join them
    return error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
  }

  // If it's another kind of error, return its message or a default
  return error instanceof Error
    ? error.message
    : 'Invalid pagination parameters';
}

/**
 * Calculate pagination parameters and metadata
 */
export const pagination = (data: unknown = {}, totalCount: number) => {
  try {
    // Validate input
    const validated = paginationDto.parse(data);

    // Set defaults for optional values
    const limit = validated.limit ?? DEFAULT_LIMIT;
    const page = validated.page ?? DEFAULT_PAGE;

    // Calculate skip and pages
    const skip = limit * (page - 1);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      pagination: {
        limit,
        skip,
        page,
      },
      meta: {
        total: {
          page: totalPages,
          limit: totalCount,
        },
        next: {
          page: page < totalPages ? page + 1 : null,
          limit,
        },
        prev: {
          page: page > 1 ? page - 1 : null,
          limit,
        },
      },
    };
  } catch (error) {
    // Format error message for better readability
    const errorMessage = formatZodError(error);
    console.error('Pagination error:', errorMessage);

    // Return just success flag and error message
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Calculate pagination metadata including total, next and previous page information
 */
export const getPageDocs = (data: {
  page: number;
  limit: number;
  count: number;
}): PageDocsResult => {
  const totalPages = Math.ceil(data.count / data.limit);

  return {
    total: {
      page: totalPages,
      limit: data.count,
    },
    next: {
      page: data.page + 1 > totalPages ? null : data.page + 1,
      limit: data.limit,
    },
    prev: {
      page: data.page - 1 <= 0 ? null : data.page - 1,
      limit: data.limit,
    },
  };
};
