import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes Prisma available globally, so you don't have to import the module everywhere
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule { }
