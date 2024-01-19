import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import response from '../interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: './assets/avatar',
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${name}_${Date.now()}.${extension}`;

                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return callback(null, false);
                }

                callback(null, true);
            },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, response<User>],
    exports: [UsersService],
})
export class UsersModule {}
