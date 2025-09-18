import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password', description: 'Password' })
  password: string;
}
