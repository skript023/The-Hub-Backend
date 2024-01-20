import { IsNotEmpty } from 'class-validator';
import { ProductDetail } from '../schema/product.detail';

export class CreateProductDto {
    _id: string
    @IsNotEmpty()
    user_id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    start_date: string;
    @IsNotEmpty()
    end_date: string;
    @IsNotEmpty()
    status: string;
    detail: ProductDetail[];
}
