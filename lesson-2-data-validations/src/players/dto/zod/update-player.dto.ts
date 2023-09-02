import { z } from 'zod';
import { playerSchema } from './player-schema';

export const updatePlayerSchema = playerSchema.partial();

export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
