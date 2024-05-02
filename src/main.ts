import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const options = {
        cors: true,
    }
    const app = await NestFactory.create(AppModule, options);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    // app.enableCors({
    //     origin: true,
    //     methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    //     credentials: true,
    // });
    await app.listen(3000);
}
bootstrap();
