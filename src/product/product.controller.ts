import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    UseInterceptors,
    UploadedFiles,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Auth({
        role: ['admin'],
        access: 'create',
    })
    @Post()
    @UseInterceptors(FileFieldsInterceptor([{ name: 'captures' }]))
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles(new ParseFilePipe({ fileIsRequired: true })) files: Express.Multer.File[]) {
        return this.productService.create(createProductDto, files);
    }

    @Auth({
        role: ['admin'],
        access: 'read',
    })
    @Get()
    findAll()
    {
        return this.productService.findAll();
    }

    @Auth({
        role: ['admin'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.productService.findOne(id);
    }

    @Auth({
        role: ['admin'],
        access: 'update',
    })
    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'img' }]))
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles(new ParseFilePipe({ fileIsRequired: true })) files: Express.Multer.File[])
    {
        return this.productService.update(id, updateProductDto, files);
    }

    @Auth({
        role: ['admin'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }

    @Get('doc/:id')
    generateDocument(@Param('id') id: string, @Res() res: Response) {
        return this.productService.generateD2PDocument(id, res);
    }
}
