import { ProductDetail } from '../schema/product.detail';

export class CreateProductDto {
    user_id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    detail: ProductDetail[];
}
