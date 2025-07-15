import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';  
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule { }
