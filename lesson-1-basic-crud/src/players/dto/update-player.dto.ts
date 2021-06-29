import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';

// PartialType: Constructs a type with all properties of Type set to optional. 
//This utility will return a type that represents all subsets of a given type.

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
