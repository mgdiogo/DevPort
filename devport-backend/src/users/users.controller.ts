import { Controller, Get, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation } from "@nestjs/swagger";

@Controller('users')

export class UsersController {
	constructor(private usersService: UsersService) { }

	@ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with a unique email and display name. Returns the user data without the password.' })
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.usersService.createUser(createUserDto);
		const { password, ...createUser } = user;

		return ({createUser, message: 'User successfully created'});
	}
}