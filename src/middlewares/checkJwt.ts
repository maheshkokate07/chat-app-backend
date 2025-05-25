import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";

declare module 'express-serve-static-core' {
    interface Request {
        client?: any;
    }
}

export const checkJWT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const urlsWithoutToken = ["/auth/login", "/auth/register", "/auth/refresh-token"];

        if (urlsWithoutToken.includes(req.url))
            return next();

        const authHeader = req.header("Authorization");
        if (!authHeader)
            return res.status(401).json({ message: "Authorization header missing" });

        const token: any = authHeader?.replace("Bearer ", "").trim();
        const payload: any = verifyAccessToken(token);

        if (!payload)
            return res.status(401).json({ message: "Invalid token" });

        req.client = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}