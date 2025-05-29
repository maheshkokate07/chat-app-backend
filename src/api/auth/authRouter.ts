import { Router } from "express";
import authController from "./authController";

const authRouter: any = (() => {
    const router = Router();

    router.post("/register", authController.registerUser);
    router.post("/login", authController.loginUser);

    return router;
})();

export default authRouter;