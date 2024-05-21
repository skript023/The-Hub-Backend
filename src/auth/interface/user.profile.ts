import { Role } from "src/role/schema/role.schema";

export default interface Profile
{
    _id: string;
    role_id: string;
    fullname: string;
    username: string;
    email: string;
    password: string;
    hardware_id: string;
    computer_name: string;
    image: string;
    expired: string;
    recent_login: string;
    remember_token: string;
    role: Role
}