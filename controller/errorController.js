// const AppError = require("../utils/appError");

// // ========== 1. Handle CastError (Invalid ID in Mongoose) ==========
// const handleCastErrorDB = (err) => {
//   const message = Invalid ${err.path}: ${err.value};
//   return new AppError(message, 400);
// };

// // ========== 2. Handle Duplicate Key Error ==========
// const handleDuplicateFieldsDB = (err) => {
//   const value = err.keyValue ? Object.values(err.keyValue)[0] : "";
//   const message = Duplicate field value: '${value}'. Please use another value.;
//   return new AppError(message, 400);
// };

// // ========== 3. Handle Validation Error ==========
// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = Invalid input data. ${errors.join(". ")};
//   return new AppError(message, 400);
// };

// // ========== 4. Send error in Development ==========
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     stack: err.stack,
//     message: err.message,
//   });
// };

// // ========== 5. Send error in Production ==========
// const sendErrorProd = (err, req, res) => {
//   // Operational error: trusted error, send message to client
//   if (err.isOperational) {
//     if (req.originalUrl.startsWith("/api")) {
//       res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     } else {
//       res.status(err.statusCode).render("error", {
//         message: err.message,
//       });
//     }
//   } else {
//     // Programming error: don't leak details to client
//     console.error("ERROR 💥", err);

//     if (req.originalUrl.startsWith("/api")) {
//       res.status(500).json({
//         status: "error",
//         message: "Something went wrong!",
//       });
//     } else {
//       res.status(500).render("error", {
//         message: "Please try again later.",
//       });
//     }
//   }
// };

// // ========== 6. Global Error Handling Middleware ==========
// const globalErrorHandler = (err, req, res, next) => {
//   err.statusCode = err.statusCode  500;
//   err.status = err.status  "error";

//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === "production") {
//     let error = Object.assign(err);

//     if (error.name === "CastError") error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (error.name === "ValidationError") error = handleValidationErrorDB(error);

//     sendErrorProd(error, req, res);
//   }
// };

// module.exports = globalErrorHandler;