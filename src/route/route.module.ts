import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './schema/route.schema';
import response from 'src/interfaces/response.dto';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Route', schema: RouteSchema }]),
	],
	controllers: [RouteController],
	providers: [RouteService, response<Route>],
})
export class RouteModule {}
