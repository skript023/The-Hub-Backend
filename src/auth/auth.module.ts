import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import response from '../interfaces/response.dto';
import { RoleSchema } from '../role/schema/role.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Role', schema: RoleSchema }]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, UsersService, response<User>],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
