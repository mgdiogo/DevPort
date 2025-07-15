import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@email.com' })
	@IsEmail({}, { message: 'Invalid email address'})
	@IsNotEmpty()
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string;

	@ApiProperty({ example: 'user' })
	@IsString()
	@IsNotEmpty()
	@MinLength(4, { message: 'Display name must contain between 4 and 25 characters' })
	@MaxLength(25, { message: 'Display name must contain between 4 and 25 characters' })
	@Transform(({ value }) => value.trim())
	display_name: string;

	@ApiProperty({ example: 'StrongPass123!' })
	@IsString()
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	},
	{ 
		message: 'Password not strong enough' 
	})
	@MaxLength(25, { message: 'Password too long' })
	@IsNotEmpty()
	password: string;
}
