import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UsersService } from '../users/users.service';
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "./utils/bcrypt";
import { compare } from 'bcrypt';
import { SafeUser } from "src/types/user.types";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private usersService: UsersService, private jwtService: JwtService) { }
	async createUser(createUserDto: CreateUserDto): Promise<User> {
		if (await this.emailTaken(createUserDto.email))
			throw new ConflictException('Email is already registered');

		if (await this.displayNameTaken(createUserDto.display_name))
			throw new ConflictException('Display name is already taken');

		const password = await hashPassword(createUserDto.password);
		const createUser = { ...createUserDto, password };
		return this.prisma.user.create({ data: createUser });
	}

	async validateUserLogin(email: string, pass: string): Promise<SafeUser> {
		const user = await this.usersService.findUserByEmail(email);

		if (!user)
			throw new UnauthorizedException('Invalid credentials');

		const validatePassword = await compare(pass, user.password);
		if (!validatePassword)
			throw new UnauthorizedException('Invalid credentials');

		const { password, createdAt, ...safeUser } = user;
		return (safeUser);
	}

	generateJwt(user: SafeUser) {
		const payload = { id: user.id, email: user.email };
		const token = this.jwtService.sign(payload);
		return { token };
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
