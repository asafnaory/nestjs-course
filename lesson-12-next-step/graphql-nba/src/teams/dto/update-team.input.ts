import { CreateTeamInput } from './create-team.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTeamInput extends PartialType(CreateTeamInput) {}
