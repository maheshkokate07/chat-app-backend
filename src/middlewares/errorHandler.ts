import { NextFunction, Request, Response } from "express";
import { handleResponse } from "../utils/responseHandler";

export const errorHandler: any = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return handleResponse.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}