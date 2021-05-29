import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class CreatePlayerDto{

    @IsNotEmpty()
    @IsString()
    readonly first_name: string
    
    @IsNotEmpty()
    @IsString()
    readonly last_name: string
    
    @IsNotEmpty()
    @IsString()
    readonly ppg : string
    
    @IsNotEmpty({ message: 'team is required' })
    @Matches('^[0-9a-fA-F]{24}$', 'ig', {
      message: 'team is not a valid id',
    })
    readonly team: any

}