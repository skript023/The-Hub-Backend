import { Logger } from '@nestjs/common';

interface DayoffResponse
{
    tanggal: string;
    keterangan: string;
    is_cuti: boolean;
}

export default class Dayoff
{
    private url = 'https://dayoffapi.vercel.app';

    async is_attendance(): Promise<boolean>
    {
        const now = new Date();

        const endpoint = `${this.url}/api?month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
        
        const response = await fetch(endpoint, { method: 'GET' });

        const dayoff = await response.json() as DayoffResponse[];

        const result = dayoff.some((response) => {
            const date = new Date(response.tanggal);

            return now.getDay() === date.getDay()
        });

        if (result) return false;

        return true;
    }
}