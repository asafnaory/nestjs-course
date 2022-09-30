import { IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateTeamDto {
    @IsNotEmpty()
    @MinLength(3)
    readonly name: string

    @IsNotEmpty()
    @IsNumber()
    readonly playersAmount: number
}
