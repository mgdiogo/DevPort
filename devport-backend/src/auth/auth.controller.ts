import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@ApiOperation({ summary: 'Login a user', description: 'Validates user credentials and returns a session token/authentication response if successful' })
	@HttpCode(200)
	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.loginUser(loginUserDto);
	}
}