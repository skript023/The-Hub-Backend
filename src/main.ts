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
              Logger.log("Allowed cors for:", origin);

              callback(null, true);
            } 
            else 
            {
              Logger.warn("blocked cors for:", origin);

              callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept', 'Observe'],
        methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();
