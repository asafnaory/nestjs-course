import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @MinLength(8)
  @MaxLength(50)
  @IsEmail()
  readonly email: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // Passwords needs at least 1 upper case letter, 
    // 1 lowercase letter, 1 number or special character
    message: `Please use a strong Password`,
  })
  readonly password: string;
}
