import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { options } from './util/whitelist/cors';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(options);

    app.use(cookieParser());
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ limit: '100mb', extended: false }));

    await app.listen(3000);
}
bootstrap();
