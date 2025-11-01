import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import USER from '../models/user.js'
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        console.log('Google profile:', profile);  //Debugging

        let user = await USER.findOne({ googleId: profile.id });
        if(user) {
            return done(null, user); 
        }

        const emailUser = await USER.findOne({
            email: profile.emails[0].value
        });
        if (emailUser){
            // Link google account to existing user
            emailUser.googleId = profile.id;
            emailUser.authProvider = 'google';
            await emailUser.save();
            return done(null, emailUser);
        }

        user = await USER.create({
            googleId: profile.id,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
            authProvider: 'google',
        });

        done(null, user);
    } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
    }
  }
));

export default passport;