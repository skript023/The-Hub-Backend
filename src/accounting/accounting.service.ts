import { Injectable } from '@nestjs/common';
import { CreateAccountingDto } from './dto/create-accounting.dto';
import { UpdateAccountingDto } from './dto/update-accounting.dto';

@Injectable()
export class AccountingService {
    async create(createAccountingDto: CreateAccountingDto) {
        return 'This action adds a new accounting';
    }

    async findAll() {
        return `This action returns all accounting`;
    }

    async findOne(id: number) {
        return `This action returns a #${id} accounting`;
    }

    async update(id: number, updateAccountingDto: UpdateAccountingDto) {
        return `This action updates a #${id} accounting`;
    }

    async remove(id: number) {
        return `This action removes a #${id} accounting`;
    }
}
