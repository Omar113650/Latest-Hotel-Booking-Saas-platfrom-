// import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
// import passport from 'passport';
// import dotenv from 'dotenv';

// dotenv.config(); // لازم قبل أي استخدام لـ process.env

// passport.use(
//   new MicrosoftStrategy(
//     {
//       clientID: process.env.MICROSOFT_CLIENT_ID,
//       clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//       callbackURL: process.env.MICROSOFT_CALLBACK_URL,
//       scope: ['user.read'],
//       passReqToCallback: true
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         // نمرر profile مباشرة بدون oauthService
//         done(null, profile);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// export default MicrosoftStrategy;
