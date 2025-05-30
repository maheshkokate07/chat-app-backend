import { NextFunction, Request, Response } from "express";
import { handleResponse } from "../../utils/responseHandler";
import relationService from "./relationService";

const relationController = {
    sendRequest: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.sendRequest({ ...req.body, fromId: userId });
            return handleResponse.success(res, "Request sent successfully", result)
        } catch (err) {
            next(err);
        }
    },

    acceptRequest: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.acceptRequest({ ...req.body, userId });
            return handleResponse.success(res, "Request accepted successfully", result);
        } catch (err) {
            next(err);
        }
    },

    rejectRequest: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.rejectRequest({ ...req.body, userId });
            return handleResponse.success(res, "Request rejected successfully", result);
        } catch (err) {
            next(err);
        }
    },
}

export default relationController;