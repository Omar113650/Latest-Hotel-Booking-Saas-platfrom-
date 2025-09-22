import Joi from "joi";

export const ActivityValidate = Joi.object({
  hotel: Joi.string().required(),
  title: Joi.string().min(3).max(100).required(),
  category: Joi.string().valid("Nature", "Pool", "Shopping", "Beach").required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().optional(),
  }).optional(),
  popular: Joi.boolean().optional(),
});
