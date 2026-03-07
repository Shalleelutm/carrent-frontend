const passport = require("passport");

const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const pool = require("../db");

// ==========================
// JWT STRATEGY
// ==========================
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const userId = payload?.id;
        if (!userId) return done(null, false);

        const [rows] = await pool.query(
          "SELECT id, email, role, profile_completed FROM app_users WHERE id = ? LIMIT 1",
          [userId]
        );
        if (!rows.length) return done(null, false);

        return done(null, rows[0]);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ==========================
// GOOGLE STRATEGY
// ==========================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const provider = "google";
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value;

        if (!providerId) return done(null, false);

        // 1) Try provider match
        const [pRows] = await pool.query(
          "SELECT * FROM app_users WHERE oauth_provider = ? AND oauth_provider_id = ? LIMIT 1",
          [provider, providerId]
        );
        if (pRows.length) return done(null, pRows[0]);

        // 2) Try email match (link existing local account)
        if (email) {
          const [eRows] = await pool.query(
            "SELECT * FROM app_users WHERE email = ? LIMIT 1",
            [email]
          );

          if (eRows.length) {
            await pool.query(
              "UPDATE app_users SET oauth_provider=?, oauth_provider_id=? WHERE id=?",
              [provider, providerId, eRows[0].id]
            );
            const [linked] = await pool.query(
              "SELECT * FROM app_users WHERE id = ? LIMIT 1",
              [eRows[0].id]
            );
            return done(null, linked[0]);
          }
        }

        // 3) Create new
        const finalEmail = email || `${providerId}@google.local`;
        const [result] = await pool.query(
          `INSERT INTO app_users (email, password_hash, role, oauth_provider, oauth_provider_id)
           VALUES (?, NULL, 'customer', ?, ?)`,
          [finalEmail, provider, providerId]
        );

        const [created] = await pool.query(
          "SELECT * FROM app_users WHERE id = ? LIMIT 1",
          [result.insertId]
        );

        return done(null, created[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ==========================
// FACEBOOK STRATEGY
// ==========================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const provider = "facebook";
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value;

        if (!providerId) return done(null, false);

        const [pRows] = await pool.query(
          "SELECT * FROM app_users WHERE oauth_provider = ? AND oauth_provider_id = ? LIMIT 1",
          [provider, providerId]
        );
        if (pRows.length) return done(null, pRows[0]);

        if (email) {
          const [eRows] = await pool.query(
            "SELECT * FROM app_users WHERE email = ? LIMIT 1",
            [email]
          );

          if (eRows.length) {
            await pool.query(
              "UPDATE app_users SET oauth_provider=?, oauth_provider_id=? WHERE id=?",
              [provider, providerId, eRows[0].id]
            );
            const [linked] = await pool.query(
              "SELECT * FROM app_users WHERE id = ? LIMIT 1",
              [eRows[0].id]
            );
            return done(null, linked[0]);
          }
        }

        const finalEmail = email || `${providerId}@facebook.local`;
        const [result] = await pool.query(
          `INSERT INTO app_users (email, password_hash, role, oauth_provider, oauth_provider_id)
           VALUES (?, NULL, 'customer', ?, ?)`,
          [finalEmail, provider, providerId]
        );

        const [created] = await pool.query(
          "SELECT * FROM app_users WHERE id = ? LIMIT 1",
          [result.insertId]
        );

        return done(null, created[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;