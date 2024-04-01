import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import cookie_param from './interface/cookies';
import { AuthGuard } from '@nestjs/passport';

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
            signInDto.identity,
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
    async getProfile(@Req() req: any): Promise<any> {
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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { token } = await this.authService.googleLogin(req);

        res.cookie('token', token, {
            httpOnly: cookie_param.httpOnly,
            secure: cookie_param.secure,
            sameSite: cookie_param.sameSite,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }).send({ message: 'Login success' }); 
    }
}
