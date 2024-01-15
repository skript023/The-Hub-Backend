import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.extractTokenFromCookie(req);

        if (!token)
            throw new UnauthorizedException(
                'MWC01 - You are not logged in, please login!',
            );

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET,
            });

            const data = JSON.parse(this.decrypt(payload.encrypted));

            const user = await this.userService.findOne(data._state);
            req['user'] = user.data;
        } catch {
            throw new UnauthorizedException(
                'MWC02 - Your login has been expired, please login again!',
            );
        }

        next();
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

    private decrypt(text: string): string | undefined {
        const key = process.env.ENCRPYPT_KEY as string;
        return Array.from(text, (c, i) =>
            String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
            ),
        ).join('');
    }
}
