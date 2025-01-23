import { Router } from "express";
import USER_CONTROLLER from "../controllers/identity.controller";

class IdentityRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/register',USER_CONTROLLER.REGISTER);
    }

    public getRoutes() {
        return this.router;
    }
}

export default new IdentityRouter();
