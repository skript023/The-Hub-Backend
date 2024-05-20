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
    Req,
    Logger,
    Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Request, Response } from 'express';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { MsaCreateAttributeRequest, MsaCreateClassProductRequest, MsaValueAttributeRequest } from 'src/telkom/wibs/product/interface/telkom.product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles(new ParseFilePipe({ 
        fileIsRequired: false,
        validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
            new FileTypeValidator({ fileType: 'image' }),
        ],
    })) files: Array<Express.Multer.File>)
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
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles(new ParseFilePipe({ 
        fileIsRequired: false,
        validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
            new FileTypeValidator({ fileType: 'image' }),
        ],
    })) files: Array<Express.Multer.File>)
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

    @Get('siebel/getProductUnderCatalog')
    getProductUnderCatalog(
        @Query('catalog_name') catalogName: string, 
        @Query('page_size') page_size: string, 
        @Query('page_num') page_num: string, 
    )
    {
        return this.productService.getProductUnderCatalog(catalogName, page_size, page_num);
    }

    @Post('siebel/createAttribute')
    createAttribute(@Body() data: MsaCreateAttributeRequest)
    {
        return this.productService.createAttribute(data);
    }

    @Post('siebel/addValueAttribute')
    addValueAttribute(@Body() data: MsaValueAttributeRequest)
    {
        return this.productService.addValueAttribute(data);
    }

    @Post('siebel/createClassProduct')
    createClassProduct(@Body() data: MsaCreateClassProductRequest)
    {
        return this.productService.createClassProduct(data);
    }

    @Get('siebel/GetMasterDataOrder')
    getMasterDataOrder(
        @Query('orderNum') orderNum: string,
        @Query('pageSize') pageSize: string,
        @Query('pageNum') pageNum: string,
    )
    {
        return this.productService.getMasterDataOrder(orderNum, pageSize, pageNum);
    }
}
