import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { Attendance } from './schema/attendance.schema';
import response from 'src/interfaces/response.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AttendanceService 
{
	constructor(
		@InjectModel(Attendance.name) private attendanceModel: mongoose.Model<Attendance>,
		private response: response<Attendance>
	)
	{}
	async create(createAttendanceDto: CreateAttendanceDto) 
	{
		axios.post('')
		return 'This action adds a new attendance';
	}

	async findAll(req: any) 
	{
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${req.user.remember_token}`,
			},
		};

		const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/April!A4:B4`);
		
		this.response.success = true;
		this.response.message = `Success get attendance`;
		this.response.data = response.data;

		return this.response.json();
	}

	async findOne(id: string) 
	{
		return `This action returns a #${id} attendance`;
	}

	async update(id: string, updateAttendanceDto: UpdateAttendanceDto) 
	{
		return `This action updates a #${id} attendance`;
	}

	async remove(id: string) 
	{
		return `This action removes a #${id} attendance`;
	}
}
