import { Router } from "express";
import {
  signUpController,
  getAUser,
  signInController,
} from "../controller/auth.controller";

const router = Router();

router.get("/user", getAUser);

router.post("/signin", signInController);

router.post("/signup", signUpController);

export default router;
