import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';
import { ConfigModule } from '@nestjs/config';
import response from '../interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
    ],
    controllers: [RoleController],
    providers: [RoleService, response<Role>],
    exports: [RoleService],
})
export class RoleModule {}
