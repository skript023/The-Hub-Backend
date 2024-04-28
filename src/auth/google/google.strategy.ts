import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/user.schema';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

	constructor(private readonly authService: AuthService) {
		super({
			access_type: 'offline',
			prompt: 'consent',
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'https://server.rena.my.id/auth/google/redirect',
			scope: ['email', 'profile'],
		});
	}

	async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { displayName, emails, photos, id } = profile
		const user: CreateUserDto = {
			email: emails[0].value,
			fullname: displayName,
			image: photos[0].value,
			remember_token: accessToken,
			password: 'telkom135',
			role_id: '',
			computer_name: '',
			expired: new Date().toISOString(),
			hardware_id: '',
			recent_login: new Date().toISOString(),
			username: displayName,
			refresh_token: refreshToken,
			google_id: id
		}

		return user;
	}
}