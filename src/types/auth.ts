export interface LoginRequest
{
    username:string;
    password:string;
}
export interface LoginResponse
{
    token:string;
    role:"ROLE_ADMIN" | "ROLE_USER";
}