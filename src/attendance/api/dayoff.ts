
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

        const current_date = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

        const response = await fetch(`${this.url}/api?month=${now.getMonth()}&year=${now.getFullYear()}`, { method: 'GET' });

        const dayoff = await response.json() as DayoffResponse;

        if ((dayoff.tanggal == current_date) || dayoff.is_cuti)
            return false;

        return true;
    }
}