import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: mongoose.Model<Role>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<any> {
        try {
            await this.roleModel.create(createRoleDto);
        } catch {
            throw new InternalServerErrorException();
        }

        return {
            message: 'Register success, redirected to login page',
            success: true,
        };
    }

    async findAll(): Promise<Role[]> {
        return this.roleModel
            .find(null, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);
    }

    async findOne(id: string): Promise<Role> {
        return this.roleModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);
    }

    async find_by_name(name: string): Promise<Role> {
        return this.roleModel.findOne({ name });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<any> {
        const role = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
            new: true,
            runValidators: true,
        });

        if (!role) throw new NotFoundException();

        return {
            message: `Role ${role.name} successfully updated`,
            success: true,
        };
    }

    async remove(id: string): Promise<any> {
        const role = await this.roleModel.findByIdAndDelete(id);

        if (!role) throw new NotFoundException();

        return {
            message: `Role ${role.name} successfully deleted`,
            success: true,
        };
    }
}
