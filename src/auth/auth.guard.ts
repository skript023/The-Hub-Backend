import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Actions } from '../role/decorator/action.decorator';
import { Roles } from '../role/decorator/role.decorator';
import { Role } from '../role/schema/role.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);
        const roles = this.reflector.get(Roles, context.getHandler());
        const actions = this.reflector.get(Actions, context.getHandler());

        const user = request['user'] as User;
        const role = request['user']['role'] as Role;

        if (!token) {
            throw new UnauthorizedException(
                'MWG01 - You are not logged in, please login!',
            );
        }

        if (!user) {
            throw new UnauthorizedException(
                'MWG02 - Your login data is invalid, please login!',
            );
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET,
            });
            const data = JSON.parse(this.decrypt(payload.encrypted));

            if (data._state != user._id)
                throw new UnauthorizedException(
                    'MWG03 - Your login data is invalid, please login!',
                );

            const role_exist = roles.some((value) => value === role?.name);

            const action_exist: boolean = role?.access[actions];

            if (!role_exist || !action_exist)
                throw new UnauthorizedException(
                    'MWG03 - You are not have authority to access this page!',
                );

            return role_exist && action_exist;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        if (request.cookies && request.cookies.token) {
            return request.cookies.token;
        }

        return null;
    }

    private extractToken(request: Request): string | undefined {
        const cookie = this.extractTokenFromCookie(request);
        const header = this.extractTokenFromHeader(request);

        console.log(`token: ${header}`);

        return cookie || header;
    }

    private decrypt(text: string): string | undefined {
        const key = process.env.ENCRPYPT_KEY as string;
        return Array.from(text, (c, i) =>
            String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
            ),
        ).join('');
    }
}
