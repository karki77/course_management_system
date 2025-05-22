import { z } from 'zod';

//
export const paginationDto = z.object({
  page: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'Page must be a number' })
        .min(1, 'Page must be a positive number'),
    )
    .optional(),
  limit: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'limit must be a number' })
        .min(1, 'Limit must be a positive number')
        .max(100, "Let's not fetch more than 100"),
    )
    .optional(),
  //
  order: z
    .enum(['ASC', 'DESC'], {
      errorMap: () => ({ message: "Must be one of 'ASC', 'DESC'" }),
    })
    .optional(),
});
