import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MaxLength, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@mail.com' })
	@IsEmail({}, { message: 'Invalid email address'})
	@IsNotEmpty()
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string;

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
	@MaxLength(35, { message: 'Password too long' })
	@IsNotEmpty()
	password: string;
}
