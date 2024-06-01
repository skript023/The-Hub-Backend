import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';

export const MSA_PRODUCT_SERVICE: any = {
	name: 'MSA_PRODUCT',
	transport: Transport.GRPC,
	options: {
		url: 'rena-gateway',
		package: 'msa_product',
		protoPath: join(__dirname, '../../../../proto/msa_product.proto'),
		// credentials: require('@grpc/grpc-js').credentials.createSsl(),
		// loader: {
		// 	keepCase: true,
		// 	longs: String,
		// 	enums: String,
		// 	defaults: true,
		// 	oneofs: true,
		// },
	},	
};