import { IsNotEmpty, IsObject } from 'class-validator';
import { AccessAction } from '../enum/access.enum';
import { AccessLevel } from '../enum/level.enum';

export class CreateRoleDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsObject()
    access: AccessAction;
    @IsNotEmpty()
    level: AccessLevel;
}
