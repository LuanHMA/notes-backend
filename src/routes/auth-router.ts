import { Router } from "express";
import { signInController } from "../controller/auth/signin-controller";
import { signUpController } from "../controller/auth/signup-controller";
import { getUserController } from "../controller/auth/get-user";

export const authRouter = Router();

authRouter.post('/signin', signInController);

authRouter.post('/signup', signUpController);

authRouter.get('/get-user', getUserController)


