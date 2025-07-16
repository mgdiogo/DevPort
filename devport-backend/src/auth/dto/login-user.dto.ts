import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({ example: 'user@mail.com' })
	@IsEmail({}, { message: 'Invalid email address'})
	@IsNotEmpty()
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string;

	@ApiProperty({ example: 'StrongPass123!' })
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	password: string;
}