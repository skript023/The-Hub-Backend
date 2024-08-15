import { HttpException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AxiosRequestConfig } from 'axios';
import { Attendance } from './schema/attendance.schema';
import response from 'src/interfaces/response.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { date } from 'src/util/date/date_format';
import { ValueInputOption } from './enum/google/value_input_option';
import { InsertDataOption } from './enum/google/insert_data_option';
import { sheets, sheets_v4, auth } from '@googleapis/sheets';
import { Cron } from '@nestjs/schedule';
import { Activity } from 'src/activity/schema/activity.schema';
import { ConfigService } from '@nestjs/config';
import Profile from 'src/auth/interface/user.profile';
import { Request } from 'express';
import Dayoff from './api/dayoff';
import HellGate from '@/util/hell_gate_bot/hell_gate';

@Injectable()
export class AttendanceService 
{
	constructor(
		@InjectModel(Attendance.name) private attendanceModel: mongoose.Model<Attendance>,
		@InjectModel(Activity.name) private activityModel: mongoose.Model<Activity>,
		private response: response<Attendance>,
		private dayoff: Dayoff,
		private hellgate: HellGate,
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
	private readonly checklist_range: any = {
		Mei: {
			month: "MEI",
			range: "'CEKLIS KEHADIRAN'!C:D"
		},
		Juni: {
			month: "JUNI",
			range: "'CEKLIS KEHADIRAN'!E:F"
		},
		Juli: {
			month: "JULI",
			range: "'CEKLIS KEHADIRAN'!G:H"
		},
		Agustus: {
			month: "AGUSTUS",
			range: "'CEKLIS KEHADIRAN'!I:J"
		},
		September: {
			month: "SEPTEMBER",
			range: "'CEKLIS KEHADIRAN'!K:L"
		},
		Oktober: {
			month: "OKTOBER",
			range: "'CEKLIS KEHADIRAN'!M:N"
		},
		November: {
			month: "NOVEMBER",
			range: "'CEKLIS KEHADIRAN'!O:P"
		},
		Desember: {
			month: "DESEMBER",
			range: "'CEKLIS KEHADIRAN'!Q:R"
		},
	};
	private getChecklist()
	{
		
	}

	async checklistAttendance()
	{
		const data: sheets_v4.Schema$ValueRange = {
			range: this.checklist_range[date.getCurrentMonth()].range,
			majorDimension: "ROWS",
			values: [
				[
					date.getCurrentDateIndex(),
					'TRUE'
				]
			]
		}
		
		const response = await this.sheets.spreadsheets.values.batchUpdate({
			spreadsheetId: '1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc',
			requestBody: {
				data: [
					data
				],
				includeValuesInResponse: true,
				valueInputOption: 'USER_ENTERED'
			}
		});

		// const response = await this.sheets.spreadsheets.values.append({
		// 	spreadsheetId: '1H5YjdyNwvyYPZizfeS2A7l8dfiIKI_yffh2DxLNGpYc',
		// 	range: this.checklist_range[date.getCurrentMonth()].range, // Specify the range
		// 	valueInputOption: ValueInputOption.USER_ENTERED,
		// 	includeValuesInResponse: true,
		// 	insertDataOption: InsertDataOption.OVERWRITE,
		// 	requestBody: data,
		// });

		if (response.status != 200)
		{
			throw new HttpException(`${response.data}`, response.status);
		}
		console.log(this.checklist_range[date.getCurrentMonth()].range)
		console.log(response.data)
		this.response.success = true;
		this.response.message = `Success checked attendance at ${date.getCurrentDate()}`;

		return this.response.json();
	}

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

	async findAll(user: Profile)
	{
		const attendance = await this.attendanceModel.find().sort({ _id: -1 });
		
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
		const attendant = await this.dayoff.is_attendance();

		if (!attendant) 
		{
			this.response.message = 'Tidak ada absen, karena hari libur/cuti bersama';
			this.response.success = false;

			await this.hellgate.send_message(`Tidak ada absen, karena hari libur/cuti bersama`);

			return this.response.json();
		}

		const absen = new CreateAttendanceDto();
		const hour   = date.getCurrentHour();
		const random = date.randomizeMinute();

		absen.date = new Date().toLocaleDateString();
		absen.deskripsi = '';
		absen.durasi = `${hour} - 17.${random}`;
		absen.jenis = 'Hadir';
		absen.type = 'Hari Kerja';

		const res = await this.create(absen);

		if (res.success)
		{
			await this.hellgate.send_message(`Attendance successfully sent with work duration ${absen.durasi}`);

			Logger.log('Attendance successfully sent', 'Auto Attendance');
		}
		else
		{
			Logger.warn('Failed send attendance', 'Auto Attendance');
		}

		return res;
	}

	@Cron('0 55 16 * * 5',  {
		name: 'Weekly Report',
		timeZone: 'Asia/Jakarta',
	})
	async weeklyReport(req: Request)
	{
		const report = new CreateAttendanceDto();

		const monday = date.getMondayDate();
		const friday = date.getFridayDate();
		
		const start = req.query.start == null ? monday : date.backdate(Number(req.query.start));
		const end = req.query.end == null ? friday : date.backdate(Number(req.query.end));

		const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
		
		const activities = await this.activityModel.find({ 
			createdAt: { $gte: start, $lte: end } 
		});

		report.date = new Date().toLocaleDateString();
		const description = activities.map(activity => activity.name).join(`\n`);

		report.deskripsi = `${date.indonesiaFormat(start)} - ${date.indonesiaFormat(end)}\n${description}`;
		report.durasi = ` `;
		report.jenis = 'Weekly Report';
		report.type = 'Hari Kerja';

		const weekly = await this.create(report);

		if (weekly.success)
		{
			await this.hellgate.send_message(`Weekly report successfully sent at ${date.getCurrentDate()} \n ${"```" + description + "```"}`);

			Logger.log(`Weekly report successfully sent`);
		}
		else
		{
			Logger.warn(`Failed send weekly report`);
		}

		return weekly.json();
	}
	async weeklyReportCheck(req: Request)
	{
		const report = new CreateAttendanceDto();

		const monday = date.getMondayDate();
		const friday = date.getFridayDate();

		const start = req.query.start == null ? monday : date.backdate(+req.query.start);
		const end = req.query.end == null ? friday : date.backdate(+req.query.end);

		const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
		
		const activities = await this.activityModel.find({ 
			createdAt: { $gte: start, $lte: end } 
		});

		report.date = new Date().toLocaleDateString();
		const description = activities.map(activity => activity.name).join(`\n`);

		report.deskripsi = `${date.indonesiaFormat(monday)} - ${date.indonesiaFormat(friday)}\n${description}`;
		report.durasi = ` `;
		report.jenis = 'Weekly Report';
		report.type = 'Hari Kerja';

		const response = await this.hellgate.send_message(`Your activity from ${start.toLocaleDateString('US-us', { year: 'numeric', month: 'long', day: 'numeric' })} to ${end.toLocaleDateString('US-us', { year: 'numeric', month: 'long', day: 'numeric' })} \n ${"```" + description + "```"}`);

		return response.json();
	}
	async attendanceCheck()
	{
		const absen = new CreateAttendanceDto();
		const hour   = date.getCurrentHour();
		const random = date.randomizeMinute();

		absen.date = new Date().toLocaleDateString();
		absen.deskripsi = '';
		absen.durasi = `${hour} - 17.${random}`;
		absen.jenis = 'Hadir';
		absen.type = 'Hari Kerja';

		const response = await this.hellgate.send_message(`Attendance successfully sent with work duration ${absen.durasi}`);

		return response.json();
	}
}
