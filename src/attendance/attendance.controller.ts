import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}

	@Post()
	create(@Req() req: any, @Body() createAttendanceDto: CreateAttendanceDto) {
		return this.attendanceService.create(req, createAttendanceDto);
	}

	@Get()
	findAll() {
		return this.attendanceService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.attendanceService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Req() req: any, @Body() updateAttendanceDto: UpdateAttendanceDto) {
		return this.attendanceService.update(id, updateAttendanceDto, req);
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: any) {
		return this.attendanceService.remove(id, req);
	}
}
