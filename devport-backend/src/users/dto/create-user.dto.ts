import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(25)
	display_name: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(30)
	password: string;
}