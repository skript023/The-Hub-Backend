import { HttpException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { Attendance } from './schema/attendance.schema';
import response from 'src/interfaces/response.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { date } from 'src/util/date/date_format';
import { SheetsAppendResponse } from './dto/google/response-append.dto';
import { ValueInputOption } from './enum/google/value_input_option';
import { InsertDataOption } from './enum/google/insert_data_option';
import { sheets, sheets_v4, auth } from '@googleapis/sheets';
import { Cron, Interval } from '@nestjs/schedule';
import { Activity } from 'src/activity/schema/activity.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttendanceService 
{
	constructor(
		@InjectModel(Attendance.name) private attendanceModel: mongoose.Model<Attendance>,
		@InjectModel(Activity.name) private activityModel: mongoose.Model<Activity>,
		private response: response<Attendance>,
		private configService: ConfigService
	)
	{
		const credentials = this.configService.get('google');
		
		const auths = new auth.GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Adjust scopes as needed
		});

		this.sheets = sheets({ version: 'v4', auth: auths });
	}

	private sheets: sheets_v4.Sheets;

	async create(createAttendanceDto: CreateAttendanceDto) 
	{
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

		const response = await this.sheets.spreadsheets.values.append({
			spreadsheetId: '1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc',
			range: `${date.getCurrentMonth()}!A:E`, // Specify the range
			valueInputOption: ValueInputOption.USER_ENTERED,
			includeValuesInResponse: true,
			insertDataOption: InsertDataOption.INSERT_ROWS,
			requestBody: data,
		});

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		const sheetsResponse = response.data;
		createAttendanceDto.range = sheetsResponse.updates.updatedRange;

		const attendance = await this.attendanceModel.create(createAttendanceDto);

		this.response.success = true;
		this.response.message = `Success checked attendance at ${attendance.date}`;

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

	async update(id: string, updateAttendanceDto: UpdateAttendanceDto) 
	{
		const attendance = await this.attendanceModel.findById(id);

		const params = `?valueInputOption=${ValueInputOption.USER_ENTERED}&includeValuesInResponse=true&key=${process.env.GOOGLE_API_KEY}`;

		const config: AxiosRequestConfig = {
			headers: {
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
		
		const response = await this.sheets.spreadsheets.values.update({
			spreadsheetId: '1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc',
			range: `${attendance.range}`, // Specify the range
			valueInputOption: ValueInputOption.USER_ENTERED,
			includeValuesInResponse: true,
			requestBody: data,
		});

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		const updatedAttendance = await this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto);

		this.response.success = true;
		this.response.message = `Success checked attendance at ${updatedAttendance.date}`;

		return this.response.json();
	}

	async remove(id: string) 
	{
		const attendance = await this.attendanceModel.findById(id);

        if (!attendance) throw new NotFoundException('Attendance not found, unable to delete');

		const response = await this.sheets.spreadsheets.values.clear({
			spreadsheetId: '1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc',
			range: `${attendance.range}`,
		});

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}

		const deletedAttendance = await this.attendanceModel.findByIdAndDelete(id);

		this.response.message = `Attendance at ${deletedAttendance.date} successfully deleted`;
        this.response.success = true;

        return this.response.json();
	}

	@Cron('0 10 07 * * 1-5',  {
		name: 'Absen',
		timeZone: 'Asia/Jakarta',
	})
	async absen()
	{
		Logger.log('Absen automatically sent');
		const absen = new CreateAttendanceDto();
		const hour   = date.getCurrentHour();
		const random = date.randomizeMinute();

		absen.date = new Date().toLocaleDateString();
		absen.deskripsi = '';
		absen.durasi = `${hour} - 17.${random}`;
		absen.jenis = 'Hadir';
		absen.type = 'Hari Kerja';

		return this.create(absen);
	}

	@Cron('0 55 16 * * 5',  {
		name: 'Weekly Report',
		timeZone: 'Asia/Jakarta',
	})
	async weeklyReport()
	{
		const report = new CreateAttendanceDto();

		const monday = date.getMondayDate();
		const friday = date.getFridayDate();
		

		const activities = await this.activityModel.find({ 
			start_date: { $gte: monday.toLocaleDateString(), $lte: friday.toLocaleDateString() }, 
			createdAt: { $gte: monday, $lte: friday } 
		});

		report.date = new Date().toString();
		const description = activities.map(activity => activity.name).join(`\n`)

		report.deskripsi = `${date.indonesiaFormat(monday)} - ${date.indonesiaFormat(friday)}\n${description}`;
		report.durasi = ` `;
		report.jenis = 'Weekly Report';
		report.type = 'Hari Kerja';

		const weekly = await this.create(report);

		if (weekly.success)
		{
			Logger.log(`Weekly report automatically sent, task is ${activities}`);

			return weekly.json();
		}

		return weekly.json();
	}
}
