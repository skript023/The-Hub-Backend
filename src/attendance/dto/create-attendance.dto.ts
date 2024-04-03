import { IsNotEmpty } from "class-validator";

export class CreateAttendanceDto 
{
    user_id: string;
    range: string;
    @IsNotEmpty()
    date: string;
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    jenis: string;
    @IsNotEmpty()
    deskripsi: string;
    @IsNotEmpty()
    durasi: string;
    justifikasi_approval: string;
    justifikasi_agenda: string;
}
