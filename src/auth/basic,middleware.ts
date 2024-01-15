import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BasicMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.extractTokenFromHeader(req);

        if (!token)
            throw new UnauthorizedException('MWC01 - API key required!');

        if (token == process.env.API_KEY) {
            next();
        } else {
            throw new UnauthorizedException('MWC02 - Your API key is invalid!');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Basic' ? token : undefined;
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
