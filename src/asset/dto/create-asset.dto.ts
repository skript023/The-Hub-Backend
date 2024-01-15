import { IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
    _id: string;
    user_id: string;
    product_id: string;
    payment_id: string;
    @IsNotEmpty()
    license: string;
    status: string;
    expired: boolean;
    @IsNotEmpty()
    expired_date: string;
}
