import { PaginationObject } from "app/shared/interface/index.interface";

export interface GetEventsList {
    status: number;
    success: boolean;
    message: string;
    result: EventsList;
}

interface EventsList extends PaginationObject {
    data: Array<Event>;
}

export interface Event {
    id: number;
    eid: string;
    circle_name: string;
    type: number;
    amount_received: string;
    target_amount: number;
    status: number;
    user: User;
}

interface User {
    name: string;
}