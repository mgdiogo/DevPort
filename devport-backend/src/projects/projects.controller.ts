import { Controller, Get, Post, Req, Body, UseGuards, InternalServerErrorException, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { SafeUser } from 'src/types/user.types';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
	constructor(private projectsSerivce: ProjectsService) { }

	@Get()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getUserProjects(@CurrentUser() user: SafeUser) {
		const projects = await this.projectsSerivce.getUserProjectsById(user.id);

		return { projects };
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	async createUserProject(@CurrentUser() user: SafeUser, @Body() createProjectDto: CreateProjectDto) {
		const project = await this.projectsSerivce.createProject(createProjectDto, user.id);

		return ({ project, message: 'Project created successfully ' });
	}
}