import { z } from 'zod';

export const playerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  ppg: z.number(),
});
