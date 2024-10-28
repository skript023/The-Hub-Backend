import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from './activity/activity.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { AssetModule } from './asset/asset.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthMiddleware } from './auth/auth.middleware';
import { BasicMiddleware } from './auth/basic.middleware';
import { ProductModule } from './product/product.module';
import { AccountingModule } from './accounting/accounting.module';
import connection from './util/database/database';
import { Logger } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { RouteModule } from './route/route.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [() => ({ google: require('../google.json') })],
        }),
        MongooseModule.forRoot(
            process.env.DB_CLOUD === 'true' ? connection.cloud : connection.local, { 
                dbName: process.env.DB_CLUSTER, 
                retryWrites: true, 
                writeConcern: { w: 'majority' } 
            }
        ),
        ActivityModule,
        UsersModule,
        RoleModule,
        AuthModule,
        // AssetModule,
        ProductModule,
        AccountingModule,
        AttendanceModule,
        RouteModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    async onModuleInit() {
        const isConnectedToCloud = process.env.DB_CLOUD === 'true';
        const connectionType = isConnectedToCloud ? 'Cloud' : 'Local';
        Logger.log(`Connected to ${connectionType} MongoDB`, `${connectionType} Connection`);
    }
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            { path: 'auth/profile', method: RequestMethod.GET },
            { path: 'auth/logout', method: RequestMethod.GET },

            { path: 'user', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.PATCH },
            { path: 'user/profile/detail', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.DELETE },

            { path: 'role', method: RequestMethod.GET },
            { path: 'role', method: RequestMethod.POST },
            { path: 'role/:id', method: RequestMethod.GET },
            { path: 'role/:id', method: RequestMethod.PATCH },
            { path: 'role/:id', method: RequestMethod.DELETE },

            { path: 'activity', method: RequestMethod.GET },
            { path: 'activity', method: RequestMethod.POST },
            { path: 'activity/:id', method: RequestMethod.GET },
            { path: 'activity/:id', method: RequestMethod.PATCH },
            { path: 'activity/:id', method: RequestMethod.DELETE },
            { path: 'activity/complete/:id', method: RequestMethod.PATCH },

            { path: 'product', method: RequestMethod.GET },
            { path: 'product', method: RequestMethod.POST },
            { path: 'product/:id', method: RequestMethod.GET },
            { path: 'product/:id', method: RequestMethod.PATCH },
            { path: 'product/:id', method: RequestMethod.DELETE },
            { path: 'product/doc/:id', method: RequestMethod.GET },
            { path: 'product/siebel/getProductUnderCatalog', method: RequestMethod.GET },
            { path: 'product/siebel/createAttribute', method: RequestMethod.POST },
            { path: 'product/siebel/addValueAttribute', method: RequestMethod.POST },
            { path: 'product/siebel/createClassProduct', method: RequestMethod.POST },
            { path: 'product/siebel/GetMasterDataOrder', method: RequestMethod.GET },
            { path: 'product/siebel/getAttributeByQuoteLineItem', method: RequestMethod.GET },

            { path: 'accounting', method: RequestMethod.GET },
            { path: 'accounting', method: RequestMethod.POST },
            { path: 'accounting/:id', method: RequestMethod.GET },
            { path: 'accounting/:id', method: RequestMethod.PATCH },
            { path: 'accounting/:id', method: RequestMethod.DELETE },

            { path: 'attendance', method: RequestMethod.GET },
            { path: 'attendance', method: RequestMethod.POST },
            { path: 'attendance/:id', method: RequestMethod.GET },
            { path: 'attendance/:id', method: RequestMethod.PATCH },
            { path: 'attendance/:id', method: RequestMethod.DELETE },

            { path: 'route', method: RequestMethod.GET },
            { path: 'route', method: RequestMethod.POST },
            { path: 'route/:id', method: RequestMethod.GET },
            { path: 'route/:id', method: RequestMethod.PATCH },
            { path: 'route/:id', method: RequestMethod.DELETE },
        );

        consumer.apply(BasicMiddleware).forRoutes({
            path: 'activity/migration',
            method: RequestMethod.POST,
        });
    }
}
