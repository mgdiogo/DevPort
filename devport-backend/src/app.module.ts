import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';


@Module({
	imports: [PrismaModule, UsersModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule { }
