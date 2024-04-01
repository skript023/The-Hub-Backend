import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/role/schema/role.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import response from 'src/interfaces/response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        @InjectModel(Role.name) private roleModel: mongoose.Model<Role>,
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
        private response: response<User>,
        private jwtService: JwtService,
    ) {}

    async findOrCreateUser(user: CreateUserDto)
    {
        const exist = await this.userService.does_user_exist(user);
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

        const result = await this.userModel.create(user);

        this.response.message = `Register an account success`;
        this.response.data = result;
        this.response.success = true;

        return this.response.json();
    }

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.userService.login(username, password);

        const encrypted = await this.encrypt(
            JSON.stringify({ _state: user._id }),
        );

        const payload = { encrypted };

        return {
            token: await this.jwtService.signAsync(payload, { expiresIn: '24h' }),
        };
    }

    async googleLogin(req: any) 
    {
        if (!req.user) {
          return 'No user from google'
        }
    
        return {
          message: 'User information from google',
          user: req.user
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
