import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import response from '../interfaces/response.dto';

import * as fs from 'fs';
import { Response } from 'express';
import { Role } from '../role/schema/role.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
        @InjectModel(Role.name) private roleModel: mongoose.Model<Role>,
        private response: response<User>
    ) {}

    async create(user: CreateUserDto, file: Express.Multer.File)
    {
        const exist = await this.does_user_exist(user);
        const default_role = await this.roleModel.findOne({ name: 'user' });

        if (exist)
            throw new BadRequestException('Username or Email already used');

        user.password = await bcrypt.hash(user.password, 10);

        user.recent_login = new Date(user.recent_login).toISOString();
        user.expired = new Date(user.expired).toISOString();

        if (user.role_id?.length == 0)
        {
            user.role_id = default_role._id;
        }

        if (file?.filename)
            user.image = file.filename;

        const result = await this.userModel.create(user);

        this.response.message = `Register an account success`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll()
    {
        const users = await this.userModel
            .find(null, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('role', ['name', 'level', 'access']);

        this.response.message = 'Success Find Users';
        this.response.data = users;
        this.response.success = true;

        return this.response.json();
    }

    async findOne(id: string)
    {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException(`${id} is not valid arguments`);

        const user = await this.userModel
            .findById(id, { password: 0, updatedAt: 0, __v: 0 })
            .populate('role', ['name', 'level', 'access'])
            .populate('route', ['_id', 'name', 'type', 'frontend', 'backend']);

        if (!user) throw new NotFoundException('User not found');

        this.response.message = 'Success Find Users';
        this.response.data = user;
        this.response.success = true;

        return this.response.json();
    }

    async login(identity: string, password: string): Promise<User> {
        const user = await this.userModel.findOne(
            { $or: [{ username: identity }, { email: identity }]},
            { createdAt: 0, updatedAt: 0, __v: 0 },
        );

        if (!user) throw new UnauthorizedException('Credential not found');

        const success = await bcrypt.compare(password, user.password);

        if (!success) {
            throw new UnauthorizedException();
        }

        user.recent_login = new Date().toISOString();
        user.expired = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
        user.save();

        return this.userModel.findById(user._id, {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
    }

    async update(id: string, user: UpdateUserDto, file: Express.Multer.File)
    {
        if (file != null)
        {
            user.image = file.filename;
        }

        if (user.password?.length > 0)
        {
            user.password = await bcrypt.hash(user.password, 10);
        }

        user.recent_login = new Date(user.recent_login).toISOString();
        user.expired = new Date(user.expired).toISOString();

        const result = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
            select: ['fullname'],
        });

        if (!result) throw new NotFoundException('User not found.');

        this.response.message = `Success update ${result.fullname} data`;
        this.response.success = true;

        return this.response.json();
    }

    async remove(id: string): Promise<any>
    {
        const user = (await this.userModel.findByIdAndDelete(id, {
            select: ['fullname'],
        })) as User;

        if (!user) throw new NotFoundException('User not found.');

        const path = `./storage/avatar/${user.image}`;

        if (fs.existsSync(path))
        {
            fs.unlinkSync(path);
        }

        this.response.message = `Success update ${user.fullname} data`;
        this.response.success = true;

        return this.response.json();
    }

    async getImage(name: string, res: Response)
    {
        if (!fs.existsSync(`./storage/avatar/${name}`))
        {
            throw new NotFoundException('Image not found');
        }
        
        res.sendFile(name, { root: `./storage/avatar` });
    }

    async does_user_exist(userCreation: CreateUserDto): Promise<boolean>
    {
        const user = await this.userModel.find({
                $or: [
                    { username: userCreation.username },
                    { email: userCreation.email },
                ],
            })
            .exec();

        if (user.length !== 0)
        {
            return true;
        }

        return false;
    }
}
