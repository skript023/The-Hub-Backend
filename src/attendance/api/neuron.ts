import { Logger } from "@nestjs/common";
import AttendanceResponse from "../dto/attendance-check.dto";
import { date } from "@/util/date/date_format";

enum Flag
{
    WFO,
    WFH,
    SPJ,
    SHIFT4
}

interface SendAttendance
{
    latitude: number;
    longitude: number;
    type_id: number;
    source_type_code: string;
    source_reference: string;
    source_dtm: string;
    ref_code: string;
    ref_id: number;
    start_dtm: string;
    start_description: string;
    flag_location: Flag;
}

class Neuron
{
    private url = "https://hrmis.neuron.id";
    async attendance_save() 
    {
        const now = new Date();
        const data: any = {
            latitude: -6.2297907,
            longitude: 106.8184312,
            type_id: 1,
            source_type_code: "WEB",
            source_reference: "",
            source_dtm: date.formatDateToYMDHMS(now),
            ref_code: "EMPLOYEE",
            ref_id: 370,
            start_dtm: date.formatDateToDDMMMYYYYHHMM(now),
            start_description: "siap",
            flag_location: Flag.WFO,
        };

        const url_data = new URLSearchParams(data).toString();

        const response = await fetch(`${this.url}/attendance/attendance/save`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookies': process.env.COOKIES,
                'Referer': 'https://hrmis.neuron.id/attendance/dashboard/form',
                'Origin': 'origin',
                'Connection': 'keep-alive',
                'Host': 'hrmis.neuron.id',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': 'Windows'
            },
            body: url_data
        });

        const json = await response.json() as ApiResponse;

        Logger.debug(json, "Attendance Check");

        if (response.status != 200)
        {
            Logger.log(`Response status - ${response.status}`, 'Neuron Attendance');

            return false;
        }

        return true;
    }

    async attendance_check()
    {
        const response = await fetch(`${this.url}/attendance/attendance/checkAttendance`, {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "ru,id;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5",
              "cache-control": "no-cache",
              "pragma": "no-cache",
              "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
              "cookie": process.env.COOKIES,
              "Referer": "https://hrmis.neuron.id/attendance/dashboard/form",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "POST"
        });

        const json =  await response.json() as AttendanceResponse;

        Logger.debug(json, "Attendance Check");

        if (response.status === 200)
        {
            if (json.data)
            {
                return json.data.can_attend;
            }
        }

        return false;
    }
}

export default new Neuron();