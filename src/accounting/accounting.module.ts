import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import response from '../interfaces/response.dto';
import { Accounting, AccountingSchema } from './schema/accounting.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Accounting', schema: AccountingSchema }])],
    controllers: [AccountingController],
    providers: [AccountingService, response<Accounting>],
})
export class AccountingModule {}
