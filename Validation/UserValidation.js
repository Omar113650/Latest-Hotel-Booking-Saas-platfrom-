import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

export const UserValidate = Joi.object({
  Name: Joi.string().min(5).max(20).required(),
  Email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(10)
    .max(50)
    .required(),
  Phone: Joi.string().min(11).max(15).required(),
  Country: Joi.string().min(2).max(50).required(),
  UserName: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .min(5)
    .max(20)
    .required(),
  Password: PasswordComplexity().required(),
  role: Joi.string().valid("Admin", "User", "Hotel Owner").optional(),
});
