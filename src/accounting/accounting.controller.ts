import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreateAccountingDto } from './dto/create-accounting.dto';
import { UpdateAccountingDto } from './dto/update-accounting.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    @Post()
    create(@Body() createAccountingDto: CreateAccountingDto) 
    {
        return this.accountingService.create(createAccountingDto);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.accountingService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) 
    {
        return this.accountingService.findOne(id);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'update',
    })
    @Patch(':id')
    update(@Param('id') id: string,@Body() updateAccountingDto: UpdateAccountingDto) 
    {
        return this.accountingService.update(id, updateAccountingDto);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) 
    {
        return this.accountingService.remove(id);
    }
}
