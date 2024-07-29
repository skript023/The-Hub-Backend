import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"
import { Logger } from '@nestjs/common';

export const whitelist = [
	'https://www.rena.my.id',
	'https://dashboard.rena.my.id',
];

export const options: CorsOptions = {
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
	allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1) 
		{
			Logger.log(`Allow request from ${origin}`, 'Whitelist');

			callback(null, true);
		}
		else if (origin === 'http://localhost:5173' && process.env.SERVER_ENVIRONMENT === 'development')
		{
			Logger.log(`Allow request from ${origin} on environment ${process.env.SERVER_ENVIRONMENT}`, 'Development');

			callback(null, true);
		}
		else if (origin === undefined)
		{
			Logger.warn(`Allow unknown request`, 'Whitelist');

			callback(null, true);
		}
		else 
		{
			Logger.warn(`Blocked request from ${origin}`);    

			callback(new Error('Not allowed by CORS'));
		}
	},
}