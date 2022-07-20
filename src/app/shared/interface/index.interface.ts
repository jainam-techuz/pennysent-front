export interface APIResponse {
    success: boolean;
    status: number;
    message: string;
    result: any;
    error: string;
}

export interface FrontPagination {
    recordPerPage: number;
    totalRecords: number;
    pages: number;
    currentPage: number;
    orderDir: string;
    orderBy: string;
}

export interface PaginationObject {
    totalRecords: number;
    currentPage: number;
    recordPerPage: number;
    previous: number;
    pages: number;
    next: number;
}