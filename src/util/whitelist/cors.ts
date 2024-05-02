import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"
import { Logger } from '@nestjs/common';

export const whitelist = [
    'https://www.rena.my.id',
    'https://dashboard.rena.my.id',
    'https://server.rena.my.id',
    'http://localhost:3000',
    'http://localhost:5173',
]

export const options: CorsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) 
        {
          Logger.log(`Allow request from ${origin}`, 'Whitelist');

          callback(null, true);
        }
        else if (origin === undefined)
        {
            Logger.debug(`Let undefined origin passed`, 'Undefine Origin');
            
            callback(null, true);
        }
        else 
        {
          Logger.warn(`Blocked request from ${origin}`);    

          callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
}