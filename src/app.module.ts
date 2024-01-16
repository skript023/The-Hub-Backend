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
import { BasicMiddleware } from './auth/basic,middleware';
import { ProductModule } from './product/product.module';
import { AccountingModule } from './accounting/accounting.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ellohim.i9hc8.mongodb.net/${process.env.DB_CLUSTER}?retryWrites=true&w=majority`,
        ),
        ActivityModule,
        UsersModule,
        RoleModule,
        AuthModule,
        AssetModule,
        ProductModule,
        AccountingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            { path: 'auth/profile', method: RequestMethod.GET },
            { path: 'auth/logout', method: RequestMethod.GET },

            { path: 'user', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.PATCH },
            { path: 'user/avatar/:name', method: RequestMethod.GET },
            { path: 'user/profile/detail', method: RequestMethod.GET },
            { path: 'user/:id', method: RequestMethod.DELETE },

            { path: 'role', method: RequestMethod.GET },
            { path: 'role/add', method: RequestMethod.POST },
            { path: 'role/detail/:id', method: RequestMethod.GET },
            { path: 'role/update/:id', method: RequestMethod.PATCH },
            { path: 'role/delete/:id', method: RequestMethod.DELETE },

            { path: 'activity', method: RequestMethod.GET },
            { path: 'activity', method: RequestMethod.POST },
            { path: 'activity/:id', method: RequestMethod.GET },
            { path: 'activity/:id', method: RequestMethod.PATCH },
            { path: 'activity/:id', method: RequestMethod.DELETE },

            { path: 'asset', method: RequestMethod.GET },
            { path: 'asset/add', method: RequestMethod.POST },
            { path: 'asset/detail/:id', method: RequestMethod.GET },
            { path: 'asset/update/:id', method: RequestMethod.PATCH },
            { path: 'asset/delete/:id', method: RequestMethod.DELETE },

            { path: 'products', method: RequestMethod.GET },
            { path: 'products/add', method: RequestMethod.POST },
            { path: 'products/detail/:id', method: RequestMethod.GET },
            { path: 'products/update/:id', method: RequestMethod.PATCH },
            { path: 'products/delete/:id', method: RequestMethod.DELETE },

            { path: 'carts', method: RequestMethod.GET },
            { path: 'carts', method: RequestMethod.POST },
            { path: 'carts/:id', method: RequestMethod.GET },
            { path: 'carts/:id', method: RequestMethod.PATCH },
            { path: 'carts/:id', method: RequestMethod.DELETE },

            { path: 'payment', method: RequestMethod.GET },
            { path: 'payment', method: RequestMethod.POST },
            { path: 'payment/:id', method: RequestMethod.GET },
            { path: 'payment/:id', method: RequestMethod.PATCH },
            { path: 'payment/:id', method: RequestMethod.DELETE },
        );

        consumer.apply(BasicMiddleware).forRoutes({
            path: 'activity/migration',
            method: RequestMethod.POST,
        });
    }
}
