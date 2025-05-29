import { NextFunction, Request, Response } from "express";

const relationController = {
    sendRequest: async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
        try {
            const { userId } = req.client;
            
        } catch (err) {
            next(err);
        }
    }
}

export default relationController;