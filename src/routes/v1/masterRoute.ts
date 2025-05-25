import express, { Request, Response } from 'express';
import { checkJWT } from '../../middlewares/checkJwt';
import authRouter from '../../api/auth/authRouter';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to chat app!");
})

router.use(checkJWT);
router.use("/auth", authRouter)

export default router;