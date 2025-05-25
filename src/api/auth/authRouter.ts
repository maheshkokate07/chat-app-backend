import { Router } from "express";
import authController from "./authController";

const authRouter: any = (() => {
    const router = Router();

    router.post("/register", authController.registerUser);

    return router;
})();

export default authRouter;