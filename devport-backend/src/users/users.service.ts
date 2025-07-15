import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "./utils/bcrypt";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto ): Promise<User> {
		const password = await hashPassword(createUserDto.password);
		const createUser = {...createUserDto, password};
		return this.prisma.user.create({ data: createUser });
	}
}