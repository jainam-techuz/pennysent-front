export interface GetUser {
    success: boolean;
    status: number;
    message: string;
    result: User;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    country_code: string;
    mobile_number: string;
    logo_url: string;
    status: number;
    role: number;
}

export interface GetWalletInfo {
    success: boolean;
    status: number;
    message: string;
    result: WalletInfo;
}

interface WalletInfo {
    id: number;
    balance: number;
    transactions: Array<Transaction>;
}

export interface Transaction {
    amount: number;
    circle_id: number;
    circle: Circle;
    created_at: string;
    payment_mode: number;
    refunded_user_id: number;
    refundedUser: RefundedUser;
}

interface Circle {
    circle_name: string;
}

interface RefundedUser {
    first_name: string;
    last_name: string;
}

export interface GetNotifications {
    success: boolean;
    status: number;
    message: string;
    result: Array<NotificationObj>;
}

export interface NotificationObj {
    type: number;
    typeName: string;
    message: string;
    read: boolean;
    created_at: string;
}