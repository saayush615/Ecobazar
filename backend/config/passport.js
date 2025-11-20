import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import USER from '../models/user.js'
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        // console.log('Google profile:', profile);  //Debugging

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
            name: profile.displayName,
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/oauth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'emails']
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        // console.log('facebook profile:', profile);

        const email = profile.emails?.[0]?.value || null;

        let user = await USER.findOne({ facebookId: profile.id });
        if (user) {
            if (email && !user.email) {
                user.email = email;
                await user.save();
            }
            return cb(null,user);
        }

        if (email) {
            const emailUser = await USER.findOne({ email });
            if (emailUser) {
                emailUser.facebookId = profile.id;
                emailUser.authProvider = 'facebook';
                await emailUser.save();
                return cb(null, emailUser);
            }
        }

        user = await USER.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: email,
            authProvider: 'facebook',
        });

        cb(null,user);
    } catch (error) {
        console.error('Facebook Auth Error:', error);
        cb(error, null);
    }
  }
));

export default passport;