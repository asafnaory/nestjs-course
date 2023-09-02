import { z } from 'zod';
import { playerSchema } from './player-schema';

export const createPlayerSchema = playerSchema.required();

export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
