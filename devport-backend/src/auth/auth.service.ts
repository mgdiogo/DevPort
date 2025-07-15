import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UnauthorizedException } from "@nestjs/common";
import { compare } from 'bcrypt';
import { hashPassword } from "./utils/bcrypt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) { }

	async loginUser(loginUserDto: LoginUserDto): Promise<any> {
		const { email, password } = loginUserDto;
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		})

		if (!user)
			throw new UnauthorizedException('Invalid credentials');

		const validatePassword = await compare(password, user.password);
		if (!validatePassword)
			throw new UnauthorizedException('Invalid credentials');

		return { message: 'Login successful' }
	}

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		if (await this.emailTaken(createUserDto.email))
			throw new ConflictException('Email is already registered');

		if (await this.displayNameTaken(createUserDto.display_name))
			throw new ConflictException('Display name is already taken');

		const password = await hashPassword(createUserDto.password);
		const createUser = { ...createUserDto, password };
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