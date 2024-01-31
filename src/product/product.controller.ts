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
    Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Response } from 'express';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles(new ParseFilePipe({ fileIsRequired: false })) files: Array<Express.Multer.File>)
    {
        return this.productService.create(createProductDto, files);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll()
    {
        return this.productService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.productService.findOne(id);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'update',
    })
    @Patch(':id')
    @UseInterceptors(AnyFilesInterceptor())
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles(new ParseFilePipe({ fileIsRequired: false })) files: Array<Express.Multer.File>)
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

    @Put('uploads/detail/captures/:id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'capture' }]))
    uploadCaptures(@Param('id') id, @UploadedFiles(new ParseFilePipe({ fileIsRequired: true })) files: Express.Multer.File[]) {
        return this.productService.multiUpload(id, files);
    }

    @Get('doc/:id')
    generateDocument(@Param('id') id: string, @Res() res: Response) {
        return this.productService.generateD2PDocument(id, res);
    }
}
