import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { string } from 'joi';
import { UppercaseValidationPipe } from 'src/common/pipes/uppercase-validation.pipes';

export class UserCreateDto {
  @IsString({ message: 'User name is required' })
  userName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/.*\d.*/, { message: 'Password must contain at least one number' })
  password: string;
}
