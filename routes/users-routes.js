import express from "express";
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
router.post("/signin", signIn);
router.post("/login", login);
router.patch("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router;
