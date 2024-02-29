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

    @Post()
    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    async create(@Body() createRoleDto: CreateRoleDto)
    {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    async findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    async findOne(@Param('id') id: string)
    {
        return this.roleService.findOne(id);
    }

    @Patch(':id')
    @Auth({
        role: ['admin'],
        access: 'update',
    })
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto)
    {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @Auth({
        role: ['admin', 'staff'],
        access: 'delete',
    })
    async remove(@Param('id') id: string)
    {
        return this.roleService.remove(id);
    }
}
