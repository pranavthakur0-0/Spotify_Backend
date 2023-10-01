
// Getting all functionalities of express module inside express variable;
const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const connnectdb = require('./mongoDbConnect/mongooseConnect.js')
const port = 4000;
const dotenv = require('dotenv');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const path = require('path');
const User = require('./models/User.js');
const authroutes = require('./routes/router.js');
const cors = require('cors');
const cloudinaryConnect = require('./cloudConnect/cloudinary.js')

dotenv.config({path : './config/config.env'});
// connect to MongoDB
connnectdb();
// connect to cloudinary
cloudinaryConnect();

//Passport Jwt



app.use(cors());
app.use(express.json());
app.use('/api', authroutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.identifier , {password : 0});
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


app.listen(port, ()=>{
    console.log("Hello World");
})