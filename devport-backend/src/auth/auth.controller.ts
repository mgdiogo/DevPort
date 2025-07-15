import { Controller, Get, Res, Post, Body, HttpCode } from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@ApiOperation({ summary: 'Login a user', description: 'Validates user credentials and returns a session token/authentication response if successful' })
	@Post('login')
	@HttpCode(200)
	async login(
		@Body() loginUserDto: LoginUserDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { token } = await this.authService.loginUser(loginUserDto);

		res.cookie('access_token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			path: '/',
			maxAge: 3600 * 1000
		});

		return ({ message: 'Login successful' });
	}

	@ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with a unique email and display name. Returns the user data without the password.' })
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.authService.createUser(createUserDto);
		const { password, ...createUser } = user;

		return ({ createUser, message: 'User successfully created' });
	}
}