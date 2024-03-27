import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import cookie_param from './interface/cookies';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: signInDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        const { token } = await this.authService.signIn(
            signInDto.username,
            signInDto.password,
        );

        res.cookie('token', token, {
            httpOnly: cookie_param.httpOnly,
            secure: cookie_param.secure,
            sameSite: cookie_param.sameSite,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }).send({ message: 'Login success' });
    }

    @Get('profile')
    async getProfile(@Request() req): Promise<any> {
        return req.user;
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', {
            httpOnly: cookie_param.httpOnly,
            secure: cookie_param.secure,
            sameSite: cookie_param.sameSite,
        }).send({ message: 'Logout success' });
    }
}
