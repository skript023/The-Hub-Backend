import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';

export const MSA_ORDER_SERVICE: any = {
	name: 'MSA_ORDER',
	transport: Transport.GRPC,
	options: {
		url: 'localhost:50051',
		package: 'msa_order',
		protoPath: join(__dirname, '../../../../proto/msa_order.proto'),
		credentials: require('@grpc/grpc-js').credentials.createSsl(),
		loader: {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		},
	},	
};