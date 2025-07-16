import { Controller, Get, Req, Res, Post, Body, HttpCode, UseGuards } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { LocalGuard } from "./guards/local.guard";
import { SafeUser } from "src/types/user.types";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@ApiOperation({ summary: 'Login a user', description: 'Validates user credentials and returns a session token/authentication response if successful' })
	@Post('login')
	@UseGuards(LocalGuard)
	@HttpCode(200)
	async login(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const user = req.user as SafeUser;

		const { token } = this.authService.generateJwt(user);
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

		return ({ createUser, message: 'Registration successful' });
	}

	@Get('status')
	@UseGuards(JwtAuthGuard)
	status(@Req() req: Request){
		return (req.user);
	}
}