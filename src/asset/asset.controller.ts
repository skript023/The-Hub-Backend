import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('asset')
export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    @Post()
    async create(@Body() createAssetDto: CreateAssetDto) {
        return this.assetService.create(createAssetDto);
    }

    @Get()
    async findAll() {
        return this.assetService.findAll();
    }

    @Get('detail/:id')
    async findOne(@Param('id') id: string) {
        return this.assetService.findOne(id);
    }

    @Patch('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateAssetDto: UpdateAssetDto,
    ) {
        return this.assetService.update(id, updateAssetDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string) {
        return this.assetService.remove(id);
    }
}
