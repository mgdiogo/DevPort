import { Injectable, ConflictException } from "@nestjs/common";
import { User } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

}