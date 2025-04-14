// auth.js
require('dotenv').config();
const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');

// Azure AD OIDC strategy configuration
const azureADOptions = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.AZURE_CLIENT_ID,
  responseType: 'code id_token',
  responseMode: 'form_post',
  redirectUrl: process.env.AZURE_REDIRECT_URI,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  allowHttpForRedirectUrl: true, // Only for development; use HTTPS in production
  scope: ['profile', 'email'],
};

// Configure the OIDC strategy
passport.use(
  new OIDCStrategy(azureADOptions, (iss, sub, profile, accessToken, refreshToken, done) => {
    if (!profile) {
      return done(new Error("No profile returned"), null);
    }
    // Optionally, you can perform database lookup/creation here.
    return done(null, profile);
  })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Export the configured passport instance
module.exports = passport;