import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Auth({
        role: ['admin'],
        access: 'create',
    })
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
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
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto)
    {
        return this.productService.update(id, updateProductDto);
    }

    @Auth({
        role: ['admin'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
