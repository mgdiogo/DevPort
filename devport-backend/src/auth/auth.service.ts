import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { UnauthorizedException } from "@nestjs/common";
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

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
}