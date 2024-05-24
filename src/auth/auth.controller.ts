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
import { cookie_dev, cookie_prod } from './interface/cookies';
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

        res.cookie('token', token, process.env.SERVER_ENVIRONMENT === 'development' ? cookie_dev : cookie_prod).send({ message: 'Login success' });
    }

    @Get('profile')
    async getProfile(@Req() req: any): Promise<any> {
        return req.user;
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', process.env.SERVER_ENVIRONMENT === 'development' ? cookie_dev : cookie_prod).send({ message: 'Logout success' });
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { token } = await this.authService.googleLogin(req);

        res.cookie('token', token, {
            httpOnly: cookie_prod.httpOnly,
            secure: cookie_prod.secure,
            sameSite: cookie_prod.sameSite,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Success Message</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div class="success-message" style="background-color: #dff0d8; border: 1px solid #d6e9c6; color: #3c763d; padding: 20px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <p>Success: Authentication Successful!</p>
        </div>
        </body>
        </html>

        `); 
    }
}
