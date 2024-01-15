import { IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    user_id: string;
    @IsNotEmpty()
    start_date: string;
    @IsNotEmpty()
    end_date: string;
    @IsNotEmpty()
    status: string;
}
