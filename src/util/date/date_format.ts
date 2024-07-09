
class date_format
{
    private months = {
        english: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],

        indonesia: [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
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

    getCurrentDateIndex(): number
    {
        const currentDate = new Date();
        const dateIndex = currentDate.getDate();

        return dateIndex;
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

    getMondayDate(): Date 
    {
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        const daysToSubtractForMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        const mondayDate = new Date(currentDate);
        mondayDate.setDate(currentDate.getDate() - daysToSubtractForMonday);
        mondayDate.setHours(0, 0, 0, 0); // Set time to start of the day (midnight)
        return mondayDate;
    }

    getFridayDate(): Date 
    {
        const currentDate        = new Date();
        const currentDayOfWeek   = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        const daysToAddForFriday = currentDayOfWeek === 5 ? 0 : 5 - currentDayOfWeek;
        const fridayDate         = new Date(currentDate);

        fridayDate.setDate(currentDate.getDate() + daysToAddForFriday);
        fridayDate.setHours(23, 59, 59, 999); // Set time to end of the day (just before midnight)
        
        return fridayDate;
    }

    getCurrentHour(): string 
    {
        const date = new Date();

        const formattedTime = date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: 'numeric', minute: 'numeric' });

        return formattedTime;
    }

    randomizeMinute(): string
    {
        // Generate a random number between 0 and 59
        const randomNumber: number = Math.floor(Math.random() * 60);

        // Ensure the result is always two digits
        const formattedNumber: string = randomNumber < 10 ? '0' + randomNumber : randomNumber.toString();

        return formattedNumber;
    }
}

export const date = new date_format();