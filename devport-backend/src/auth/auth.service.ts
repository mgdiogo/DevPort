import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UsersService } from '../users/users.service';
import { CreateUserDto } from "./dto/create-user.dto";
import { jwtPayload } from "./strategies/jwt.strategy";
import { hashPassword } from "./utils/bcrypt";
import { compare } from 'bcrypt';
import { SafeUser } from "src/types/user.types";
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';


@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRedis() private readonly redis: Redis
	) { }

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

	verifyRefreshToken(token: string): jwtPayload {
		try {
			const jwToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET! });

			return (jwToken);
		} catch (err) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}
	}

	generateJwt(payload: jwtPayload): { token: string, refreshToken: string } {
		try {
			const { id, email } = payload;
			const token = this.jwtService.sign({ id, email });

			const refreshToken = this.jwtService.sign({ id, email },
				{ secret: process.env.JWT_SECRET!, expiresIn: '7d' });
			return { token, refreshToken };
		} catch {
			throw new Error('Server failed to generate tokens');
		}
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

	async blacklistToken(token: string) {
		const decoded = this.jwtService.decode(token);
		const tokenExp = decoded.exp * 1000;

		const now = Date.now();
		const ttl = tokenExp - now;

		if (ttl > 0)
			await this.redis.set(`bl:${token}`, 'blacklisted', 'PX', ttl);
	}

	async isBlacklisted(token: string): Promise<boolean> {
		const blacklisted = await this.redis.get(`bl:${token}`);

		if (blacklisted)
			return true;
		return false;
	}
}
