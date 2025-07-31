import { Module } from '@nestjs/common';
import { ApiKeysController } from './apikeys.controller';
import { ApiKeysService } from './apikeys.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [ApiKeysController],
	providers: [ApiKeysService]
})
export class ApikeysModule { }
