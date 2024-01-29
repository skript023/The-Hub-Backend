import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    async create(product: CreateProductDto, files: Array<Express.Multer.File>) 
    {
        product._id = null;
        product.start_date = new Date(product.start_date).toLocaleDateString();
        product.end_date = new Date(product.end_date).toLocaleDateString();

        if (files?.length >= 1)
        {
            for (const detail of product.detail)
            {
                detail.captures.forEach((capture, index) => {
                    capture.image = `${[product.name]}_${files[index].originalname}`;
                });
            }
        }

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

    async update(id: string, products: UpdateProductDto, files: Array<Express.Multer.File>) 
    {
        products.start_date = new Date(products.start_date).toLocaleDateString();
        products.end_date = new Date(products.end_date).toLocaleDateString();

        if (files?.length >= 1)
        {
            for (const detail of products.detail)
            {
                if (detail.captures)
                {
                    detail.captures.forEach((capture, index) => {
                        capture.image = `${[products.name]}_${files[index].originalname}`;
                    });
                }
            }
        }

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

    async multiUpload(id: string, files: Express.Multer.File[])
    {
        const product = await this.productModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (!product) throw new NotFoundException('Unable to add file to non-existing data');

        let captures: any = [];

        const update = product.detail.map((detail) =>
        {
            for (let i = 0; i < files['capture'].length; i++)
            {
                captures.push({ image: files['capture'][i]?.filename });
            }

            detail.captures = captures;

            return detail;
        });

        product.detail = update;

        const saved = await this.productModel.findByIdAndUpdate(id, product, {
            new: true,
            runValidators: true,
        });

        this.response.message = `Success uploads ${saved.name} product`;
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
        const filename = `Deployment_to_Production_${product_name.replace(' ', '_')}.docx`;

        if (fs.existsSync(`./template/d2p-doc.docx`))
        {
            const result = `./template/${filename}`;

            const types = product.detail.map((detail) => {
                const data = [
                    new TextRun({
                        text: `${detail.type}`,
                        bold: true,
                        size: `${14}pt`,
                        font: 'Calibri',
                    }),
                    new TextRun({
                        break: 1
                    }),
                ];

                detail.attributes?.map((attribute) => {
                    data.push(new TextRun({
                        text: `${attribute.name}: ${attribute.value}`,
                        size: `${11}pt`,
                        font: 'Calibri',
                        break: 1
                    }))
                });

                data.push(new TextRun({
                    text: `Status: ${detail.status}`,
                    size: `${11}pt`,
                    font: 'Calibri',
                    break: 1
                }));

                data.push(new TextRun({
                    text: `No Order: ${detail.order_num}`,
                    size: `${11}pt`,
                    font: 'Calibri',
                    break: 1
                }),
                new TextRun({
                    break: 2
                }));

                detail.captures?.map((capture) => {
                    if (fs.existsSync(`./storage/uat/capture/${capture.image}`)) {
                        data.push(new ImageRun({ data: fs.readFileSync(`./storage/uat/capture/${capture.image}`), transformation: { width: 635, height: 331 } }));
                    }
                });

                return new Paragraph({
                    spacing: {
                        line: 300
                    },
                    
                    children: data
                });
            });

            const document = await patchDocument(fs.readFileSync("./template/d2p-doc.docx"), {
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
                    sign_date: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()),
                            bold: true,
                            size: `${11}pt`,
                            font: 'Verdana'
                        })]
                    },
                    product_small: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun({
                            text: product_name,
                            size: `${8}pt`,
                            font: 'Calibri'
                        })],
                    },
                    product_discount: {
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
            });

            fs.writeFileSync(result, document);

            return res.sendFile(filename, { root: './template' });
        }

        this.response.message = 'Failed generate document';
        this.response.success = false;

        res.status(404).json(this.response.json());
    }
}
