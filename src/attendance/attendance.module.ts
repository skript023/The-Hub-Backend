import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import response from 'src/interfaces/response.dto';
import { Attendance } from './schema/attendance.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Attendance', schema: Attendance }]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
	],
	controllers: [AttendanceController],
	providers: [AttendanceService, response<Attendance>],
})
export class AttendanceModule {}
