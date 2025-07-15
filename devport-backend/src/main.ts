import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prisma = app.get(PrismaService);
	app.useGlobalPipes(new ValidationPipe());
	await prisma.enableShutdownHooks(app);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
