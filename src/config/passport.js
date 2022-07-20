const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { Product } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    // if (payload.type !== tokenTypes.ACCESS) {
    //   throw new Error('Invalid token type');
    // }
    //TODO: Bypassing for now
    // const product = await Product.findById(payload.sub);
    // if (!product) {
    //   return done(null, false);
    // }
    // done(null, product);
    // done(null, {role: 'admin'})
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
