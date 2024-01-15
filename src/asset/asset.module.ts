import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { AssetSchema } from './schema/asset.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Asset', schema: AssetSchema }]),
    ],
    controllers: [AssetController],
    providers: [AssetService],
})
export class AssetModule {}
