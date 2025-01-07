export default interface AttendanceResponse {
    guid: number;
    code: number;
    info: string;
    data: AttendanceData;
}
  
interface AttendanceData {
    can_attend: boolean;
    attendance: Attendance | null;
    shift: Shift | null;
    attend_type: number;
    auto_pop: boolean;
    info: string;
}
  
interface Attendance {
    id: string;
    type_id: string;
    start_dtm: string | null; // Date-Time in string format
    start_description: string | null;
    end_dtm: string | null;
    end_description: string | null;
    ref_code: string;
    ref_id: string;
    source_type_code: string;
    source_reference: string | null;
    source_dtm: string | null;
    overtime_start_dtm: string | null;
    overtime_end_dtm: string | null;
    longitude: string | null;
    latitude: string | null;
    flag_location: string;
}
  
interface Shift {
    timetable_shift_id: string;
    timetable_id: string;
    day_no: string;
    is_workday: string;
    on_duty_time: string;
    off_duty_time: string;
    in_beginning_time: string;
    in_ending_time: string;
    out_beginning_time: string;
    out_ending_time: string;
    late_time: string;
    leave_early_time: string;
    overtime_start_time: string;
    start_date: string | null;
    end_date: string | null;
    updated_by: string | null;
    update_dtm: string | null;
}
  