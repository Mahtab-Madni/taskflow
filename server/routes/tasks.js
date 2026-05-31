import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);

router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority value"),
    body("dueDate")
      .notEmpty()
      .withMessage("Due date is required")
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("dueTime")
      .optional({ checkFalsy: true })
      .if((value) => value && value.trim() !== "")
      .matches(/^([0-1]\d|2[0-3]):[0-5]\d$/)
      .withMessage("Invalid time format (use HH:mm)"),
  ],
  createTask,
);

router.get("/:id", getTaskById);

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("status")
      .optional()
      .isIn(["pending", "completed"])
      .withMessage("Invalid status value"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority value"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("dueTime")
      .optional({ checkFalsy: true })
      .if((value) => value && value.trim() !== "")
      .matches(/^([0-1]\d|2[0-3]):[0-5]\d$/)
      .withMessage("Invalid time format (use HH:mm)"),
  ],
  updateTask,
);

router.patch("/:id/toggle", toggleTaskStatus);

router.delete("/:id", deleteTask);

export default router;
