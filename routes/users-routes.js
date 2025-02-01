import express from "express";
import { check } from "express-validator";
import {
  signIn,
  deleteUser,
  getUserById,
  updateUser,
  login,
  getUsers,
} from "../controllers/users-controllers.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:uid", getUserById);
router.post(
  "/signin",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 5 }),
    check("email").normalizeEmail().isEmail(),
  ],
  signIn
);
router.post("/login", login);
router.patch("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router;
