import { Controller, Get, Post, Req, Body, UseGuards, HttpCode, Param } from '@nestjs/common';
import { ApiKeysService } from './apikeys.service';
import { CurrentProject } from 'src/common/decorators/curret-project.decorator';
import { Project } from '@prisma/client';

@Controller('apikeys')
export class ApiKeysController {
	constructor(private apiKeysService: ApiKeysService) { }

	@Get()
	async getApiKeys(@CurrentProject() project: Project) {
		const keys = await this.apiKeysService.getApiKeysById(project.id);

		return { keys };
	}
}
