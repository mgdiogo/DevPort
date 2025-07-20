import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
	@ApiProperty({ example: 'Project X' })
	@IsNotEmpty({ message: 'A project name must be provided'})
	@MinLength(6)
	@MaxLength(25)
	@Transform(({ value }) => value.trim())
	name: string;

	@ApiProperty({ example: 'This is a personal project involving backend!' })
	@IsString()
	@MaxLength(150, { message: 'Description has a max of 150 characters' })
	description: string;
}
