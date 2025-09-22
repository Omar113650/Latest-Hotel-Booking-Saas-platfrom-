// import { Strategy as GitHubStrategy } from 'passport-github2';
// import passport from 'passport';
// import dotenv from 'dotenv';
// dotenv.config();

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.GITHUB_CALLBACK_URL,
//       scope: ['user:email'],
//       passReqToCallback: true
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         // هنا ممكن تمرر profile مباشرة بدون oauthService
//         done(null, profile);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// export default GitHubStrategy;
