import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import response from '../interfaces/response.dto';
import { Product, ProductSchema } from './schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: './storage/uat/capture',
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
    controllers: [ProductController],
    providers: [ProductService, response<Product>],
})
export class ProductModule {}
