import express from "express";
import validator from "../middleware/validator.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();
router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  validator(createUserSchema),
  createUser,
);
router.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);
router.put(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  validator(updateUserSchema),
  updateUser,
);
router.delete("/:id", requireAuth, authorizeRoles("admin"), deleteUser);

export default router;
