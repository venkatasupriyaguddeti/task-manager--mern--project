import express from "express";
import validator from "../middleware/validator.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validator(registerSchema), register);
router.post("/login", validator(loginSchema), login);

export default router;
