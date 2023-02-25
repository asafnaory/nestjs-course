import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePlayerInput } from './create-player.input';

@InputType()
export class UpdatePlayerInput extends PartialType(CreatePlayerInput) {}
