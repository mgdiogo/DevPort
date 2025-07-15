import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from './app.module';

const PORT = process.env.JS_PORT!;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prisma = app.get(PrismaService);
	app.useGlobalPipes(new ValidationPipe({
		transform: true
	}));
	await prisma.enableShutdownHooks(app);
	const config = new DocumentBuilder()
		.setTitle('DevPort API')
		.setDescription('API documentation for the DevPort backend')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);
	app.use(cookieParser());
	await app.listen(PORT);
}
bootstrap();
