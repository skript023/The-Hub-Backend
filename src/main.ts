import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { whitelist } from './util/whitelist/cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: (origin, callback) => {
            if (whitelist.indexOf(origin) !== -1) 
            {
              Logger.log(`Requested by ${origin}`, 'Whitelist');

              callback(null, true);
            } 
            else 
            {
              Logger.warn(`Blocked request from ${origin}`);    

              callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();
