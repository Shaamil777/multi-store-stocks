export interface User {
    id:string,
    name: string;
    email: string;
    role: "admin" | "shopper";
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}