import { IsNotEmpty } from 'class-validator';
import { ProductDetail } from '../schema/product.detail';
import { ProductDossier } from '../schema/product.dossier';

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
    dossier: ProductDossier;
}
