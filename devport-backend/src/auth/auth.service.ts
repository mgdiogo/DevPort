import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
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
import { v4 as uuidv4 } from "uuid";


@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRedis() private readonly redis: Redis
	) { }

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		try {
			if (await this.emailTaken(createUserDto.email))
				throw new ConflictException('Email is already registered');

			const password = await hashPassword(createUserDto.password);
			const createUser = { ...createUserDto, password };
			return this.prisma.user.create({ data: createUser });

		} catch (err) {
			if (err instanceof ConflictException) throw err;
			throw new InternalServerErrorException('Failed to create user: ' + err.message);
		}
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

	generateJwt(payload: jwtPayload): { token: string, refreshToken: string, jti: string } {
		try {
			const jti = uuidv4();
			const { id, display_name } = payload;
			const token = this.jwtService.sign({ id, display_name, token_type: 'access' });

			const refreshToken = this.jwtService.sign({ id, display_name, jti, token_type: 'refresh' },
				{ secret: process.env.JWT_SECRET!, expiresIn: '7d' });
			return { token, refreshToken, jti };
		} catch (err) {
			throw new InternalServerErrorException('Server failed to generate tokens: ' + err.message);
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

	async blacklistToken(token: string) {
		const decoded = this.jwtService.decode(token) as { jti?: string, exp?: number };

		if (!decoded?.jti || !decoded?.exp)
			throw new UnauthorizedException('Invalid token');

		const tokenExp = decoded.exp * 1000;
		const now = Date.now();
		const ttl = tokenExp - now;

		if (ttl > 0)
			await this.redis.set(`bl:jti:${decoded.jti}`, 'blacklisted', 'PX', ttl);
	}
}
