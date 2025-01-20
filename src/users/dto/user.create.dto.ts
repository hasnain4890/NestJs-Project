import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UppercaseValidationPipe } from 'src/common/pipes/uppercase-validation.pipes';

export class UserCreateDto {

  @IsString({ message: 'User name is required' })
  userName: string;

  @IsString()
  @IsEmail()
  email: string;
}
