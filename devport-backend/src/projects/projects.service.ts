import { ConflictException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from "@prisma/client";

@Injectable()
export class ProjectsService {
	constructor(private prisma: PrismaService) { }

	async getUserProjectsById(id: number) {
		return this.prisma.project.findMany({
			where: {
				ownerId: id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async createProject(createProjectDto: CreateProjectDto, ownerId: number): Promise<Project> {
		try {
			if (await this.validateProjectName(createProjectDto.name))
				throw new ConflictException('You already have a project with this name');

			return await this.prisma.project.create({ data: { ...createProjectDto, ownerId } });
		} catch (err) {
			if (err instanceof ConflictException) throw err;
			throw new InternalServerErrorException('Failed to create project: ' + err.message);
		}
	}

	async validateProjectName(projName: string): Promise<boolean> {
		const projectName = await this.prisma.project.findFirst({
			select: {
				name: true
			},
			where: {
				name: projName
			}
		})

		return (!!projectName);
	}
}
