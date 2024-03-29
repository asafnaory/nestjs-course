import { Team } from '@prisma/client';

export class ResponsePlayerDto {
  constructor(
    private id: string,
    private firstName: string,
    private lastName: string,
    private ppg: number,
    private team?: Team,
  ) {}
}
