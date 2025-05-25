import { NextFunction, Request, Response } from "express";
import authService from "./authService";
import { handleResponse } from "../../utils/responseHandler";

const authController = {
    registerUser: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const result = await authService.register(req.body);
            return handleResponse.success(res, "User registered successfully", result);
        } catch (err) {
            next(err);
        }
    }
}

export default authController;