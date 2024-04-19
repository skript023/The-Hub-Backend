import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import response from 'src/interfaces/response.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Attendance, AttendanceSchema } from './schema/attendance.schema';
import { ActivitySchema } from 'src/activity/schema/activity.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Attendance', schema: AttendanceSchema }, { name: 'Activity', schema: ActivitySchema }]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
	],
	controllers: [AttendanceController],
	providers: [AttendanceService, response<Attendance>],
})
export class AttendanceModule {}
