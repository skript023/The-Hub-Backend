import {
    Module,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import response from '../interfaces/response.dto';
import { existsSync, mkdirSync } from 'fs';
import { RoleSchema } from '../role/schema/role.schema';
import hash from 'src/util/hash/md5';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Role', schema: RoleSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const path = './storage/avatar';
                    if (!existsSync(path)) {
                        mkdirSync(path, { recursive: true });
                    }

                    cb(null, path);
                },
                filename: (req, file, cb) => {
                    const user = req.body as User;
                    const extension = file.originalname.split('.')[1];
                    const filename = `${hash.md5(`${user.username}_${new Date()}`)}.${extension}`;

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
