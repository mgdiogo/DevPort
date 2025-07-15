import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findUserByEmail(email: string, include?: Prisma.UserInclude) {
		return await this.prisma.user.findUnique({
			where: {
				email
			},
			include
		})
	}
}