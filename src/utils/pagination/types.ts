import { z } from 'zod';
import { paginationDto } from './validation';

/**
 * Type for pagination parameters derived from Zod schema
 */
export type PaginationParams = z.infer<typeof paginationDto>;

/**
 * Type for pagination result
 */
export interface PageDocsResult {
  total: {
    page: number;
    limit: number;
  };
  next: {
    page: number | null;
    limit: number;
  };
  prev: {
    page: number | null;
    limit: number;
  };
}

/**
 * Input type for getPageDocs function
 */
export interface PageDocProps {
  page: number;
  limit: number;
  count: number;
}
