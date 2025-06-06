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
            const result = await relationService.acceptRequest({ ...req.body, fromId: userId });
            return handleResponse.success(res, "Request accepted successfully", result);
        } catch (err) {
            next(err);
        }
    },

    rejectRequest: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.rejectRequest({ ...req.body, fromId: userId });
            return handleResponse.success(res, "Request rejected successfully", result);
        } catch (err) {
            next(err);
        }
    },

    blockUser: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.blockUser({ ...req.body, fromId: userId });
            return handleResponse.success(res, "User blocked", result);
        } catch (err) {
            next(err);
        }
    },

    unblockUser: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.unblockUser({ ...req.body, fromId: userId });
            return handleResponse.success(res, "User unblocked", result);
        } catch (err) {
            next(err);
        }
    },

    unfriendUser: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            const result = await relationService.unfriendUser({ ...req.body, fromId: userId });
            return handleResponse.success(res, "User unfriend success", result);
        } catch (err) {
            next(err);
        }
    }
}

export default relationController;