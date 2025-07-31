import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
	@ApiProperty({ example: 'Frontend Key' })
	@IsOptional()
	@IsString()
	@MaxLength(50)
	@Transform(({ value }) => value.trim())
	label?: string;
}
