
class date_format
{
    private months = {
        english: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],

        indonesia: [
            'Januari', 'Februari', 'Maret', 'April', 'Mai', 'Juni',
            'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember'
        ]
    };

    private 

    getCurrentDate(): string
    {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();

        return `${day} ${this.months.english[monthIndex]} ${year}`;
    }

    getCurrentMonth(): string
    {
        const currentDate = new Date();
        const monthIndex = currentDate.getMonth();

        return `${this.months.indonesia[monthIndex]}`
    }

    indonesiaFormat(date: Date): string
    {
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${this.months.indonesia[monthIndex]} ${year}`;
    }
}

export const date = new date_format();