export interface User{
    id:number;
    email:string;
    username:string;
    active:boolean;
    role:"ROLE_ADMIN"|"ROLE_USER",
    createdAt:string;
}
