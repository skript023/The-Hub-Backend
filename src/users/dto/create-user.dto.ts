import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    role_id: string;
    @IsNotEmpty()
    readonly fullname: string;
    @IsNotEmpty()
    @MaxLength(32)
    readonly username: string;
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    readonly hardware_id: string;
    readonly computer_name: string;
    image: string;
    expired: string;
    recent_login: string;
    readonly remember_token: string;
}
