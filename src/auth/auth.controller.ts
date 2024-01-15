import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';

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
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        }).send({ message: 'Login success' });
    }

    @Get('profile')
    async getProfile(@Request() req): Promise<any> {
        return req.user;
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).send({ message: 'Logout success' });
    }
}
