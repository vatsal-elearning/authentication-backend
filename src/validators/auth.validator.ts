import { UserType } from "@types"
import Joi from "joi"

export const loginValidator = Joi.object<UserType>({
  email: Joi.string().email().required().messages({
    "string.empty": "Email should not be empty",
    "string.email": "Email is invalid",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password should not be empty",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
})

export const registerValidator = Joi.object<UserType>({
  firstName: Joi.string().min(3).required().messages({
    "string.empty": "First name should not be empty",
    "string.min": "First name must be at least 3 characters long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(3).required().messages({
    "string.empty": "Last name should not be empty",
    "string.min": "Last name must be at least 3 characters long",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email should not be empty",
    "string.email": "Email is invalid",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "number")
    .pattern(/[\W_]/, "symbol")
    .required()
    .messages({
      "string.empty": "Password should not be empty",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.name": "Password must include at least one {#name}.",
      "any.required": "Password is required.",
    }),
  role: Joi.string().required().messages({
    "string.empty": "Role should not be empty",
    "any.required": "Role is required",
  }),
})
