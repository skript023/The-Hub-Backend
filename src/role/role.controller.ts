import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post('add')
    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    async create(@Body() createRoleDto: CreateRoleDto): Promise<any> {
        const role = await this.roleService.create(createRoleDto);

        return {
            message: `Create role ${role.name} success`,
        };
    }

    @Get()
    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    async findAll(): Promise<Role[]> {
        return this.roleService.findAll();
    }

    @Get('detail/:id')
    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    async findOne(@Param('id') id: string): Promise<Role> {
        return this.roleService.findOne(id);
    }

    @Patch('update/:id')
    @Auth({
        role: ['admin'],
        access: 'update',
    })
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<any> {
        const role = await this.roleService.update(id, updateRoleDto);

        return {
            message: `Update role ${role.name} success`,
        };
    }

    @Delete('delete/:id')
    @Auth({
        role: ['admin', 'staff'],
        access: 'delete',
    })
    async remove(@Param('id') id: string): Promise<any> {
        const role = await this.roleService.remove(id);

        return {
            message: `Delete role ${role.name} success`,
        };
    }
}
