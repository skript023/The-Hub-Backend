import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import response from 'src/interfaces/response.dto';

import * as mongoose from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: mongoose.Model<Product>, private response: response<Product>)
    { }

    async create(product: CreateProductDto) 
    {
        product.start_date = new Date(product.start_date).toLocaleDateString();
        product.end_date = new Date(product.end_date).toLocaleDateString();

        const result = await this.productModel.create(product);

        if (!result)
            throw new InternalServerErrorException('Failed to save product UAT');

        this.response.message = `Product ${result.name} saved successfully`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll() 
    {
        const products = await this.productModel
            .find(null, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        this.response.data = products;
        this.response.message = 'Successfully retrieved products data';
        this.response.success = true;

        return this.response.json();
    }

    async findOne(id: number)
    {
        const product = await this.productModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        if (!product) throw new NotFoundException('Transaction data not found.');

        this.response.data = product;
        this.response.message = 'Successfully retrieved product data';
        this.response.success = true;

        return this.response.json();
    }

    async update(id: number, products: UpdateProductDto) 
    {
        products.start_date = new Date(products.start_date).toLocaleDateString();
        products.end_date = new Date(products.end_date).toLocaleDateString();

        const product = await this.productModel.findByIdAndUpdate(id, products, {
                new: true,
                runValidators: true,
        });

        if (!product)
            throw new InternalServerErrorException('Unable to update non-existing data');

        this.response.message = `Success update ${product.name} product`;
        this.response.success = true;
		
		return this.response.json();
    }

    async remove(id: number) 
    {
        const product = await this.productModel.findByIdAndDelete(id);

        if (!product) throw new InternalServerErrorException('Unable to delete non-existing data');

        this.response.message = `Success delete ${product.name} product`;
        this.response.success = true;

        return this.response.json();
    }
}
