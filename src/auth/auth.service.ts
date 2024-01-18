import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

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

    private async encrypt(text: string): Promise<string> {
        const key = process.env.ENCRPYPT_KEY as string;
        return Array.from(text, (c, i) =>
            String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
            ),
        ).join('');
    }
}
