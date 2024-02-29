import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import response from '../interfaces/response.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: mongoose.Model<Role>,
        private response: response<Role>
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<response<Role>>
    {
        const role = await this.roleModel.create(createRoleDto);

        this.response.message = `You have successfully create role ${role.name}.`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll(): Promise<response<Role>>
    {
        const roles = await this.roleModel.find(null, { createdAt: 0, updatedAt: 0, __v: 0 }).populate('user', ['fullname', 'username']);

        if (roles.length <= 0)
        {
            this.response.message = `0 roles found.`;
            this.response.success = true;

            return this.response.json();
        }

        this.response.message = 'Roles data found';
        this.response.success = true;
        this.response.data = roles;

        return this.response.json();
    }

    async findOne(id: string): Promise<response<Role>>
    {
        const role = await this.roleModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 }).populate('user', ['fullname', 'username']);

        if (!role)
        {
            throw new NotFoundException('Role not found');
        }

        this.response.message = 'Role found';
        this.response.success = true;
        this.response.data = role;

        return this.response.json();
    }

    async find_by_name(name: string): Promise<response<Role>>
    {
        const role = await this.roleModel.findOne({ name });

        if (!role)
        {
            throw new NotFoundException('Role not found');
        }

        this.response.message = 'Role found';
        this.response.success = true;
        this.response.data = role;

        return this.response.json();
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<response<Role>> {
        const role = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
            new: true,
            runValidators: true,
        });

        if (!role) throw new NotFoundException('Role not found, unable to update.');

        this.response.message = `Role ${role.name} successfully updated`;
        this.response.success = true;
        this.response.data = role;

        return this.response.json();
    }

    async remove(id: string): Promise<response<Role>> {
        const role = await this.roleModel.findByIdAndDelete(id);

        if (!role) throw new NotFoundException('Role not found, unable to delete');

        this.response.message = `Role ${role.name} successfully deleted`;
        this.response.success = true;
        this.response.data = role;

        return this.response.json();
    }
}
