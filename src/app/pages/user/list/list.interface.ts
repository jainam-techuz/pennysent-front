import { PaginationObject } from "app/shared/interface/index.interface";

export interface GetUsersList {
    status: number;
    success: boolean;
    message: string;
    result: UsersList;
}

interface UsersList extends PaginationObject {
    data: Array<User>;
}

export interface User {
    id: number;
    eid: string;
    name: string;
    first_name: string;
    last_name: string;
    contact: string;
    email: string;
    balance: number;
    status: number;
    logo_url: string;
    logoClass: string;
}