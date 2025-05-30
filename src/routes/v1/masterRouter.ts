import express, { Request, Response } from 'express';
import { checkJWT } from '../../middlewares/checkJwt';
import authRouter from '../../api/auth/authRouter';
import relationRouter from '../../api/relation/relationRouter';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to chat app!");
})

router.use(checkJWT);
router.use("/auth", authRouter);
router.use("/relation", relationRouter);

export default router;