import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}

	@Post()
	create(@Body() createAttendanceDto: CreateAttendanceDto) {
		return this.attendanceService.create(createAttendanceDto);
	}

	@Get()
	findAll(@Req() req: any) {
		return this.attendanceService.findAll(req);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: any) {
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
