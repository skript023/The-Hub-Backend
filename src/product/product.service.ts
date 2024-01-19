import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import response from 'src/interfaces/response.dto';
import * as fs from 'fs';
import path from 'path';

import * as mongoose from 'mongoose';
import { ExternalHyperlink, ImageRun, Paragraph, patchDocument, PatchType, TextRun } from "docx";
import { Response } from 'express';

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

    async findOne(id: string)
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

    async update(id: string, products: UpdateProductDto) 
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

    async remove(id: string) 
    {
        const product = await this.productModel.findByIdAndDelete(id);

        if (!product) throw new InternalServerErrorException('Unable to delete non-existing data');

        this.response.message = `Success delete ${product.name} product`;
        this.response.success = true;

        return this.response.json();
    }

    async generateD2PDocument(id: string, res: Response)
    {
        const product = await this.productModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        if (!product) throw new NotFoundException('Product data not found.');

        const product_split = product.name.split('UAT ');
        const product_name = product_split[product_split.length - 1];

        if (fs.existsSync(`./template/d2p-doc.docx`))
        {
            const result = `./template/Deployment_to_Production_${product_name.replace(' ', '_')}.docx`;

            const types = product.detail.map((detail) => {
                const details = `
                ${detail.type}\n

                ${detail.attributes?.map((attribute) => {
                    return `${attribute.name}: ${attribute.value}`
                })}\n
                Status: ${detail.status}\n
                No Order: ${detail.order_num}\n
                `
                return new Paragraph({
                    text: detail.type,
                    
                    children: [
                        new TextRun({
                            text: `Status: ${detail.status}`,
                            break: 1
                        }),
                        new TextRun({
                            text: `No Order: ${detail.order_num}`,
                            break: 1
                        })
                    ]
                })
            });

            patchDocument(fs.readFileSync("./template/d2p-doc.docx"), {
                patches: {
                    product_name: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: product_name,
                            bold: true,
                            size: `${11}pt`,
                            font: 'Verdana'
                        })],
                    },
                    date_raised: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()),
                            bold: true,
                            size: `${11}pt`,
                            font: 'Verdana'
                        })]
                    },
                    activities: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: product_name,
                            size: `${8}pt`,
                            font: 'Calibri'
                        })],
                    },
                    purpose: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: product_name,
                            size: `${11}pt`,
                            font: 'Verdana'
                        })],
                    },
                    detail: {
                        type: PatchType.DOCUMENT,
                        children: types
                    }
                },
            }).then((doc) => {
                fs.writeFileSync(result, doc);

                res.sendFile(path.resolve(__dirname, result)); 
            });
        }

        this.response.message = 'Failed generate document';
        this.response.success = false;

        res.status(404).json(this.response.json());
    }
}
