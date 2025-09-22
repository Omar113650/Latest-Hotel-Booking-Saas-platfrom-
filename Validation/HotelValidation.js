import Joi from "joi";

export const HotelValidate = Joi.object({
  user: Joi.string().required(),
  hotelName: Joi.string().min(3).max(100).required(),
  registrationNo: Joi.string().required(),
  address: Joi.string().min(5).required(),
  facilities: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      icon: Joi.string().optional(),
      value: Joi.string().required(),
    })
  ).optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().optional(),
    })
  ).optional(),
  documents: Joi.array().items(
    Joi.object({
      type: Joi.string().valid("text", "image").required(),
      content: Joi.string().required(),
      publicId: Joi.string().optional(),
    })
  ).optional(),
  status: Joi.string().valid("Pending", "Approved", "Rejected").optional(),
  pricePerDay: Joi.number().min(0).optional(),
  statusHotel: Joi.string().valid("available", "not available").optional(),
});







