import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.JS_PORT!;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prisma = app.get(PrismaService);
	app.useGlobalPipes(new ValidationPipe({
		transform: true
	}));
	await prisma.enableShutdownHooks(app);
	await app.listen(PORT);
}
bootstrap();
