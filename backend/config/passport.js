const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails &&
          profile.emails.length > 0
            ? profile.emails[0].value.toLowerCase()
            : null;

        if (!email) {
          return done(
            new Error("Google account does not have an email")
          );
        }

        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = await User.findOne({
            email,
          });
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            email,
            profilePicture:
              profile.photos &&
              profile.photos.length > 0
                ? profile.photos[0].value
                : "",
          });
        } else {
          user.googleId = profile.id;

          if (profile.displayName) {
            user.name = profile.displayName;
          }

          if (
            profile.photos &&
            profile.photos.length > 0
          ) {
            user.profilePicture =
              profile.photos[0].value;
          }

          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;