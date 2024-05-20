import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import response from '../interfaces/response.dto';
import { Product, ProductSchema } from './schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { ClientsModule } from '@nestjs/microservices';
import { MSA_PRODUCT_SERVICE } from 'src/telkom/wibs/product/telkom.product';
import { MSA_ORDER_SERVICE } from 'src/telkom/wibs/order/telkom.order';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
        ClientsModule.register([
            MSA_PRODUCT_SERVICE,
            MSA_ORDER_SERVICE
        ]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const path = `./storage/uat/capture`;

                    if (!fs.existsSync(path))
                    {
                        fs.mkdirSync(path, { recursive: true });
                    }

                    cb(null, path);
                },
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${req.body.name}_${name}.${extension}`;

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
    controllers: [ProductController],
    providers: [ProductService, response<Product>],
    exports: [ProductService]
})
export class ProductModule {}
