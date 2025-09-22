import passport from "passport";
import User from "../model/user.js";
import tokenService from "../service/TokenServices.js";
import AppError from "../utils/AppError.js";

// =========================
// Helpers
// =========================
const mapProfileToUser = (profile) => ({
  id: profile.id,
  email: profile.emails?.[0]?.value,
  name: profile.displayName || profile.username,
  picture: profile.photos?.[0]?.value,
  profileUrl: profile.profileUrl,
});

const generateUserTokens = async (user) => {
  const accessToken = tokenService.generateToken(user._id, "access");
  const refreshToken = tokenService.generateToken(user._id, "refresh");
  await tokenService.storeRefreshToken(user._id, refreshToken);
  return { user, accessToken, refreshToken };
};

// =========================
// OAuth User Management
// =========================
const handleOAuthUser = async (profile, provider) => {
  try {
    let user = await User.findOne({ [`oauth.${provider}.id`]: profile.id });

    if (user) {
      user.oauth[provider] = mapProfileToUser(profile);
      await user.save({ validateBeforeSave: false });
      return await generateUserTokens(user);
    }

    if (profile.emails?.[0]?.value) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.oauth[provider] = mapProfileToUser(profile);
        await user.save({ validateBeforeSave: false });
        return await generateUserTokens(user);
      }
    }

    // create new
    const userData = {
      email: profile.emails[0].value,
      name: profile.displayName || profile.username,
      isEmailVerified: true,
      oauth: { [provider]: mapProfileToUser(profile) },
    };
    const newUser = await User.create(userData);
    return await generateUserTokens(newUser);
  } catch (error) {
    throw new AppError(`OAuth authentication failed: ${error.message}`, 400);
  }
};

// =========================
// Passport OAuth Methods
// =========================
const initiateOAuth = (provider) => {
  const scopes = {
    google: ["profile", "email"],
    github: ["user:email"],
    microsoft: ["user.read"],
  };
  return passport.authenticate(provider, {
    session: false,
    scope: scopes[provider],
  });
};

const handleOAuthCallback = (provider) => {
  return async (req, res, next) => {
    passport.authenticate(
      provider,
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user)
            return next(
              new AppError(`OAuth authentication with ${provider} failed`, 401)
            );

          if (!user.accessToken || !user.refreshToken) {
            const tokens = await handleOAuthUser(user, provider);
            user = { ...user, ...tokens };
          }

          // set cookie
          const isProduction = process.env.NODE_ENV === "production";
          res.cookie("refreshToken", user.refreshToken, {
            expires: new Date(
              Date.now() +
                process.env.JWT_REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
          });

          if (req.get("Accept")?.includes("application/json")) {
            return res.status(200).json({
              message: `${provider} OAuth login successful`,
              user: {
                _id: user.user._id,
                name: user.user.name,
                email: user.user.email,
                isEmailVerified: user.user.isEmailVerified,
              },
              accessToken: user.accessToken,
            });
          } else {
            return res.redirect(
              `${process.env.FRONTEND_URL}/oauth-success?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`
            );
          }
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
  };
};

// =========================
// Exported OAuth Routes
// =========================
export const googleLogin = initiateOAuth("google");
export const googleCallback = handleOAuthCallback("google");

export const githubLogin = initiateOAuth("github");
export const githubCallback = handleOAuthCallback("github");

export const microsoftLogin = initiateOAuth("microsoft");
export const microsoftCallback = handleOAuthCallback("microsoft");
