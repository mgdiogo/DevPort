import { Controller, Get, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller('users')

export class UsersController {
	constructor(private usersService: UsersService) { }

}