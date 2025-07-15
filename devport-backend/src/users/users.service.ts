import { Injectable, ConflictException } from "@nestjs/common";
import { User } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "./utils/bcrypt";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto ): Promise<User> {
		if (await this.emailTaken(createUserDto.email))
			throw new ConflictException('Email is already registered');

		if (await this.displayNameTaken(createUserDto.display_name))
			throw new ConflictException('Display name is already taken');

		const password = await hashPassword(createUserDto.password);
		const createUser = {...createUserDto, password};
		return this.prisma.user.create({ data: createUser });
	}

	async emailTaken(email: string): Promise<Boolean> {
		const emailExists = await this.prisma.user.findFirst({
			where: {
				email
			}
		})
		
		return (!!emailExists);
	}

	async displayNameTaken(display_name: string): Promise<Boolean> {
		const nameExists = await this.prisma.user.findFirst({
			where: {
				display_name
			}
		})

		return (!!nameExists);
	}
}