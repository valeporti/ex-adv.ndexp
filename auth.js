'use strict';

const bcrypt      = require('bcrypt');
const passport    = require('passport');
const LocalStrategy = require('passport-local');
const session     = require('express-session');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
  
  //Set Up Passport and session
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  
  
  //serialization and app.listen
      
      passport.serializeUser((user, done) => {
         done(null, user._id);
       });
  
      passport.deserializeUser((id, done) => {
              db.collection('users').findOne(
                  {_id: new ObjectID(id)},
                  (err, doc) => {
                      done(null, doc);
                  }
              );
          });
  
      passport.use(new LocalStrategy(
        function(username, password, done) {
          db.collection('users').findOne({ username: username }, function (err, user) {
            console.log('User '+ username +' attempted to log in.');
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            //if (password !== user.password) { return done(null, false); }
            if (!bcrypt.compare(password, user.password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));
  
  
  
  

}
