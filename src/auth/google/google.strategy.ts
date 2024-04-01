import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

	constructor(private readonly authService: AuthService) {
	super({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: 'https://2e87-180-252-164-36.ngrok-free.app/auth/google/redirect',
		scope: ['email', 'profile', 'https://www.googleapis.com/auth/spreadsheets'],
	});
	}

	async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { name, emails, photos } = profile
		const user: CreateUserDto = {
			email: emails[0].value,
			fullname: name.givenName + name.familyName,
			image: photos[0].value,
			remember_token: accessToken,
			password: 'telkom135',
			role_id: '',
			computer_name: 'None',
			expired: new Date().toISOString(),
			hardware_id: '',
			recent_login: new Date().toISOString(),
			username: name.givenName
		}
		
		console.log(profile);
		const createdUser = await this.authService.findOrCreateUser(user);
		
		done(null, profile);
	}
}