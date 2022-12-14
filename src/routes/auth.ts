import { Router } from "express";
import { body } from "express-validator";

import User from "../models/user";
import * as authController from "../controllers/auth";
import isAuth from "../middleware/isAuth";

const router = Router();

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 5 })
      .notEmpty()
      .withMessage("Please enter a name"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail already exists");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

export default router;
