import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { Attendance } from './schema/attendance.schema';
import response from 'src/interfaces/response.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import google from './api/google';
import { date } from 'src/util/date/date_format';
import { SheetsAppendResponse } from './dto/google/response-append.dto';
import { ValueInputOption } from './enum/google/value_input_option';
import { InsertDataOption } from './enum/google/insert_data_option';

@Injectable()
export class AttendanceService 
{
	constructor(
		@InjectModel(Attendance.name) private attendanceModel: mongoose.Model<Attendance>,
		private response: response<Attendance>
	)
	{}

	private defaultRow = 3;

	async create(req: any, createAttendanceDto: CreateAttendanceDto) 
	{
		const params = `?valueInputOption=${ValueInputOption.USER_ENTERED}&includeValuesInResponse=true&insertDataOption=${InsertDataOption.INSERT_ROWS}`;

		const config: AxiosRequestConfig = {
			headers: {
				'Authorization': `Bearer ${req.user.remember_token}`,
				'Content-Type': 'application/json'
			},
		};

		const data = {
			"range": `${date.getCurrentMonth()}!A:E`,
			"majorDimension": "ROWS",
			"values": [
				[
					date.indonesiaFormat(new Date(createAttendanceDto.date)),
					createAttendanceDto.type,
					createAttendanceDto.jenis,
					createAttendanceDto.deskripsi,
					createAttendanceDto.durasi
				]
			]
		}

		const response = await axios.post(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/${date.getCurrentMonth()}!A:E:append${params}`, data, config);

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}


		const sheetsResponse = response.data as SheetsAppendResponse;
		createAttendanceDto.range = sheetsResponse.updates.updatedRange;

		const attendance = await this.attendanceModel.create(createAttendanceDto);

		this.response.success = true;
		this.response.message = `Success checked attendance at ${attendance.date}`;
		this.response.data = response.data;

		return this.response.json();
	}

	async findAllInSheets(req: any) 
	{
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${req.user.remember_token}`,
			},
		};

		const response = await axios.get(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/April!A4:E`, config);
		
		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		this.response.success = true;
		this.response.message = `Success get attendance`;
		this.response.data = response.data;

		return this.response.json();
	}

	async findAll()
	{
		const attendance = await this.attendanceModel.find(null);

        if (attendance.length <= 0)
        {
            this.response.message = `0 attendance found.`;
            this.response.success = true;

            return this.response.json();
        }

        this.response.message = 'Attendance data found';
        this.response.success = true;
        this.response.data = attendance;

        return this.response.json();
	}

	async findOne(id: string) 
	{
		const attendance = await this.attendanceModel.findById(id);

		if (!attendance) throw new NotFoundException('Attendance not found');

		this.response.success = true;
		this.response.message = `Success get attendance`;
		this.response.data = attendance;

		return this.response.json();
	}

	async update(id: string, updateAttendanceDto: UpdateAttendanceDto, req: any) 
	{
		const attendance = await this.attendanceModel.findById(id);

		const params = `?valueInputOption=${ValueInputOption.USER_ENTERED}&includeValuesInResponse=true`;

		const config: AxiosRequestConfig = {
			headers: {
				'Authorization': `Bearer ${req.user.remember_token}`,
				'Content-Type': 'application/json'
			},
		};

		const data = {
			"range": `${attendance.range}`,
			"majorDimension": "ROWS",
			"values": [
				[
					date.indonesiaFormat(new Date(updateAttendanceDto.date)),
					updateAttendanceDto.type,
					updateAttendanceDto.jenis,
					updateAttendanceDto.deskripsi,
					updateAttendanceDto.durasi
				]
			]
		}
		console.log(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/${attendance.range}${params}`);
		
		const response = await axios.put(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/${attendance.range}${params}`, data, config);

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		const updatedAttendance = await this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto);

		this.response.success = true;
		this.response.message = `Success checked attendance at ${updatedAttendance.date}`;

		return this.response.json();
	}

	async remove(id: string, req: any) 
	{
		const config: AxiosRequestConfig = {
			headers: {
				'Authorization': `Bearer ${req.user.remember_token}`
			},
		};
		
		const attendance = await this.attendanceModel.findById(id);
		console.log(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/${attendance.range}:clear`);

        if (!attendance) throw new NotFoundException('Attendance not found, unable to delete');

		const response = await axios.post(`${google.sheets}/1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc/values/${attendance.range}:clear`, null, config);

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		const deletedAttendance = await this.attendanceModel.findByIdAndDelete(id);

		this.response.message = `Attendance at ${deletedAttendance.date} successfully deleted`;
        this.response.success = true;

        return this.response.json();
	}
}
