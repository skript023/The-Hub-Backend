import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { User } from 'src/auth/decorator/user.decorator';
import Profile from 'src/auth/interface/user.profile';

@Controller('attendance')
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}

	@Post('report/weekly')
	weeklyReport() {
		return this.attendanceService.weeklyReport();
	}

	@Get('report/check')
	weeklyReportCheck() {
		return this.attendanceService.weeklyReportCheck();
	}

	@Get('report/attend-check')
	attendanceCheck() {
		return this.attendanceService.attendanceCheck();
	}

	@Post('attend')
	attend() {
		return this.attendanceService.absen();
	}

	@Post()
	create(@Body() createAttendanceDto: CreateAttendanceDto) {
		return this.attendanceService.create(createAttendanceDto);
	}

	@Get()
	findAll(@User() user: Profile) {
		return this.attendanceService.findAll(user);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.attendanceService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
		return this.attendanceService.update(id, updateAttendanceDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.attendanceService.remove(id);
	}
}
