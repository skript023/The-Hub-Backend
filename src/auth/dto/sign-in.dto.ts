import { IsNotEmpty, IsString } from 'class-validator';

export class signInDto {
    @IsNotEmpty()
    @IsString()
    identity: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}
