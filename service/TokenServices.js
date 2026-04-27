import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import Token from "../model/Token.js";

class TokenService {
  generateToken(userId, type) {
    const secrets = {
      access: process.env.JWT_ACCESS_SECRET,
      refresh: process.env.JWT_REFRESH_SECRET,
      passwordReset: process.env.JWT_PASSWORD_RESET_SECRET,
      emailVerification: process.env.JWT_EMAIL_VERIFICATION_SECRET,
    };
    const expiresIn = {
      access: process.env.JWT_ACCESS_EXPIRES_IN,
      refresh: process.env.JWT_REFRESH_EXPIRES_IN,
      passwordReset: "10m",
      emailVerification: "1d",
    };

    const secret = secrets[type];
    const expiresInValue = expiresIn[type];

    if (!secret) {
      throw new AppError(`JWT secret for ${type} token is not defined`, 500);
    }

    return jwt.sign({ id: userId }, secret, { expiresIn: expiresInValue });
  }

  async verifyToken(token, type) {
    const secrets = {
      access: process.env.JWT_ACCESS_SECRET,
      refresh: process.env.JWT_REFRESH_SECRET,
      passwordReset: process.env.JWT_PASSWORD_RESET_SECRET,
      emailVerification: process.env.JWT_EMAIL_VERIFICATION_SECRET,
    };

    const secret = secrets[type];

    if (!secret) {
      throw new AppError(`JWT secret for ${type} token is not defined`, 500);
    }

    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(`${type} token has expired`, 401);
      }
      if (error.name === "JsonWebTokenError") {
        throw new AppError(`Invalid ${type} token`, 401);
      }
      throw new AppError("Token verification failed", 401);
    }
  }

  async storeRefreshToken(userId, refreshToken) {
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "7"),
    );

    const tokenDoc = await Token.create({
      token: refreshToken,
      userId: userId,
      type: "refresh",
      expiresAt: expiresAt,
    });

    return tokenDoc;
  }

  async verifyRefreshToken(refreshToken) {
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      type: "refresh",
    }).populate("userId");
    if (!tokenDoc) {
      throw new AppError("Refresh token not found in database", 401);
    }

    if (tokenDoc.expiresAt < new Date()) {
      await Token.findByIdAndDelete(tokenDoc._id);
      throw new AppError("Refresh token has expired", 401);
    }

    return tokenDoc.userId;
  }

  async removeRefreshToken(refreshToken) {
    await Token.findOneAndDelete({ token: refreshToken, type: "refresh" });
  }

  async removeAllRefreshTokensForUser(userId) {
    await Token.deleteMany({ userId: userId, type: "refresh" });
  }
}

export default new TokenService();
