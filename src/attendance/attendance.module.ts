import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import response from 'src/interfaces/response.dto';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Attendance, AttendanceSchema } from './schema/attendance.schema';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import Dayoff from './api/dayoff';
import HellGate from '@/util/hell_gate_bot/hell_gate';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{ 
				name: Attendance.name,
				useFactory: (connection: Connection) => {
					const schema = AttendanceSchema;

					const AutoIncrement = AutoIncrementFactory(connection as any) as any;

					schema.plugin(AutoIncrement, { 
						id: 'attedance_seq',
						inc_field: 'sequence',
					});
					
					return schema;
				},
				inject: [getConnectionToken()],
			}, 
			{ 
				name: Activity.name, 
				useFactory: () => {
					const schema = ActivitySchema;

					return schema;
				},
			},
		]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
	],
	controllers: [AttendanceController],
	providers: [AttendanceService, response<Attendance>, Dayoff, HellGate],
})
export class AttendanceModule {}
