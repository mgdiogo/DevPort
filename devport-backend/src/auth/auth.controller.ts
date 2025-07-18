import { Controller, Get, Req, Res, Post, Body, HttpCode, UseGuards, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { LocalGuard } from "./guards/local.guard";
import { RefreshGuard } from "./guards/refresh.guard";
import { jwtPayload } from "./strategies/jwt.strategy";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

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
		const user = req.user as jwtPayload;
		const { token, refreshToken } = this.authService.generateJwt(user);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		return ({ access_token: token, message: 'Login successful' });
	}

	@ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with a unique email and display name. Returns the user data without the password.' })
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.authService.createUser(createUserDto);
		const { password, ...createUser } = user;

		return ({ createUser, message: 'Registration successful' });
	}

	@Post('refresh')
	@UseGuards(RefreshGuard)
	@HttpCode(200)
	async refresh(@CurrentUser() user: jwtPayload, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
		if (!user)
			throw new UnauthorizedException('Missing user payload');

		const { token, refreshToken: newRefreshToken } = this.authService.generateJwt(user);
		await this.authService.blacklistToken(req.cookies['refresh_token']);

		res.cookie('refresh_token', newRefreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
		});

		return ({ token });
	}

	@Post('logout')
	@HttpCode(200)
	async logout(@Req() req: Request) {
		const token = req.cookies['refresh_token'];

		if (token)
			await this.authService.blacklistToken(token);
	}

	@Get('status')
	@UseGuards(JwtAuthGuard)
	status(@CurrentUser() user: jwtPayload) {
		return (user);
	}
}