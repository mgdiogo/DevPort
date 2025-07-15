import { Controller, Get, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')

export class UsersController {
	constructor(private usersService: UsersService) { }

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.usersService.createUser(createUserDto);
		const { password, ...createUser } = user;

		return (createUser);
	}
}