interface AttendanceDetail {
    attd_detail_id: string;
    attendance_id: string;
    timetable_id: string;
    attd_in_out: number;
    ip_address: string;
    geocode_location: string;
    xs1: string | null;
  }
  
  interface Attendance {
    id: string;
    type_id: string;
    start_dtm: string;
    start_description: string;
    end_dtm: string;
    end_description: string;
    ref_code: string;
    ref_id: string;
    source_type_code: string;
    source_reference: string;
    source_dtm: string;
    overtime_start_dtm: string | null;
    overtime_end_dtm: string | null;
    longitude: string;
    latitude: string;
    flag_location: string;
  }
  
  interface Data {
    attendance: Attendance;
    detail: AttendanceDetail;
  }
  
  interface ApiResponse {
    guid: number;
    code: number;
    info: string;
    data: Data;
  }
  