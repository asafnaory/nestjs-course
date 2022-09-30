import { IsString } from "class-validator";

export class UserToAdminDto {
    @IsString()
    id: string
}