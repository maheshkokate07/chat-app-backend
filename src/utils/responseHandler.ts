import { Response } from "express";

export const handleResponse = {
    success: (res: Response, message: string, data?: any) => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },

    error: (res: Response, message: string, statusCode: number = 500, error?: any) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error: error && process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}