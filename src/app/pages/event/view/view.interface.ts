export interface GetEvent {
    success: boolean;
    status: number;
    message: string;
    result: Event;
}

export interface Event {
    id: number;
    circle_name: string;
    circle_deadline: string;
    circle_description: string;
    status: number;
    type: number;
    circle_code: string;
    target_amount: number;
    amount_received: number;
    user: User;
    contributors: Array<Contribution>
}

interface User {
    name: string;
    logo_url: string;
}

export interface Contribution {
    contributed: number;
    contributed_on: string;
    logoClass: string;
    user: User;
}