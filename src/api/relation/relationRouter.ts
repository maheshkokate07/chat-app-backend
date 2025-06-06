import { Router } from "express";
import relationController from "./relationController";

const relationRouter: any = (() => {
    const router = Router();

    router.post("/send-request", relationController.sendRequest);
    router.post("/accept-request", relationController.acceptRequest);
    router.post("/reject-request", relationController.rejectRequest);
    router.post("/block-user", relationController.blockUser);
    router.post("/unblock-user", relationController.unblockUser);
    router.post("/unfriend-user", relationController.unfriendUser);
    return router;
})();

export default relationRouter;