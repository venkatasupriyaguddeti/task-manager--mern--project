import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  dueDate: Joi.date().optional().allow(null),
  userId: Joi.string().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  dueDate: Joi.date().optional().allow(null),
  userId: Joi.string().optional(),
}).min(1);
