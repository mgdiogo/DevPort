import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProjectsModule } from './projects/projects.module';


@Module({
	imports: [
		PrismaModule,
		UsersModule,
		AuthModule,
		RedisModule.forRoot({
			type: 'single',
			url: process.env.REDIS_URL!
		}),
		ProjectsModule
	],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule { }
