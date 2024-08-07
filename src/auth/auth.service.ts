import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/role/schema/role.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import response from 'src/interfaces/response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        @InjectModel(Role.name) private roleModel: mongoose.Model<Role>,
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
        private response: response<User>,
        private jwtService: JwtService,
    ) {}

    async findOrCreateUser(user: CreateUserDto): Promise<response<User>>
    {
        const exist = await this.userService.does_user_exist(user);
        const default_role = await this.roleModel.findOne({ name: 'user' });

        if (exist)
        {
            const foundUser = await this.userModel.findOne({ $and: [{ google_id: user.google_id }, { email: user.email }]});

            foundUser.remember_token = user.remember_token;
            foundUser.google_id = user.google_id;
            foundUser.save();

            this.response.message = `Register an account success`;
            this.response.data = foundUser[0];
            this.response.success = true;

            return this.response.json();
        }

        user.password = await bcrypt.hash(user.password, 10);

        user.recent_login = new Date(user.recent_login).toISOString();
        user.expired = new Date(user.expired).toISOString();

        if (user.role_id?.length == 0)
        {
            user.role_id = default_role._id;
        }

        const result = await this.userModel.create(user);

        this.response.message = `Register an account success`;
        this.response.data = result;
        this.response.success = true;

        return this.response.json();
    }

    async signIn(identity: string, password: string): Promise<any> {
        const user = await this.userService.login(identity, password);

        const encrypted = await this.encrypt(
            JSON.stringify({ _state: user._id }),
        );

        const payload = { encrypted };

        Logger.log(`Login success as ${user.fullname}`);

        return {
            token: await this.jwtService.signAsync(payload, { expiresIn: '24h' }),
        };
    }

    async googleLogin(req: any): Promise<any>
    {
        if (!req.user) 
        {
          return 'No user from google'
        }

        const createdUser = (await this.findOrCreateUser(req.user)).data as User;

        const user = await this.userModel.findOne({ $and: [{ email: req.user.email }, { google_id: req.user.google_id }]});

        if (!user) throw new UnauthorizedException('Unauthorized user doesnt exist');

        const encrypted = await this.encrypt(
            JSON.stringify({ _state: user._id }),
        );

        const payload = { encrypted };

        Logger.log(`Login success as ${user.fullname}`);

        return {
            token: await this.jwtService.signAsync(payload, { expiresIn: '24h' }),
        };
    }

    async checkAuth(req: Request)
    {
        const token = (req.cookies && req.cookies.token) ?? null;

        try 
        {
            if (!token)
                throw new UnauthorizedException('SVC01 - You are not logged in, please login!');

            await this.jwtService.verifyAsync(req.cookies.token, {
                secret: process.env.SECRET,
            });

            return { message: 'Authorized', success: true };
        } 
        catch (error) 
        {
            throw new UnauthorizedException(
                'SVC - Your login has been expired, please login again!',
            );
        }
    }

    private async encrypt(text: string): Promise<string> {
        const key = process.env.ENCRPYPT_KEY as string;
        return Array.from(text, (c, i) =>
            String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
            ),
        ).join('');
    }
}
