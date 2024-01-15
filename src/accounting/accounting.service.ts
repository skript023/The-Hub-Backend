import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAccountingDto } from './dto/create-accounting.dto';
import { UpdateAccountingDto } from './dto/update-accounting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Accounting } from './schema/accounting.schema';
import response from 'src/interfaces/response.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class AccountingService {
	constructor(
        @InjectModel(Accounting.name)
        private accountingModel: mongoose.Model<Accounting>,
        private response: response<Accounting>,
    ) {}

    async create(transaction: CreateAccountingDto) : Promise<response<Accounting>>
	{
        transaction.date = new Date(transaction.date).toLocaleDateString();

        const result = await this.accountingModel.create(transaction);

        if (!result)
            throw new InternalServerErrorException('Failed to save transaction');

        this.response.message = `Transaction ${result.title} saved successfully`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll() : Promise<response<Accounting>>
	{
        const transactions = await this.accountingModel
            .find(null, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        this.response.data = transactions;
        this.response.message = 'Successfully retrieved transactions data';
        this.response.success = true;

        return this.response.json();
    }

    async findOne(id: number) : Promise<response<Accounting>>
	{
        const transaction = await this.accountingModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        if (!transaction) throw new NotFoundException('Transaction data not found.');

        this.response.data = transaction;
        this.response.message = 'Successfully retrieved transaction data';
        this.response.success = true;

        return this.response.json();
    }

    async update(id: number, transactions: UpdateAccountingDto) : Promise<response<Accounting>> 
	{
        transactions.date = new Date(transactions.date).toLocaleDateString();

        const transaction = await this.accountingModel.findByIdAndUpdate(
            id,
            transactions,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!transaction)
            throw new NotFoundException('Unable to update non-existing data');

        this.response.message = `Success update ${transaction.title} transaction`;
        this.response.success = true;
		
		return this.response.json();
    }

    async remove(id: number) : Promise<response<Accounting>>
	{
        const transaction = await this.accountingModel.findByIdAndDelete(id);

        if (!transaction) throw new NotFoundException('Unable to update non-existing data');

        this.response.message = `Success delete ${transaction.title} transaction`;
        this.response.success = true;

        return this.response.json();
    }
}
