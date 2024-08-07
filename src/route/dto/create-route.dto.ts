import { IsNotEmpty } from "class-validator";

export class CreateRouteDto
{
    _id: string;
    @IsNotEmpty()
    role_id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    type: string;
    frontend: string;
    backend: string;
}
