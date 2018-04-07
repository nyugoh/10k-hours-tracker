import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
const router = express.Router();
const Article = mongoose.model('Article');
import User from '../models/Users';

module.exports = (app) => {
  app.use('/', router);
};

// TODO:: ADDED A ROUTE AND PAGE TO MANAGE USERS
const isLoggedIn = (req, res, next) =>{
  (!req.isAuthenticated())? res.redirect('/signin'): next();
};
// TODO:: Return login middleware
router.get('/', (req, res, next) => {
  Article.find((err, articles) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles,
      appName: process.env.APP_NAME,
      user: req.user
    });
  });
});

router.get('/signin', (req, res) =>{
  if(req.isAuthenticated())
    res.redirect('/');
  else
    res.render('forms/login', {title: 'Login Page', user: req.user, message: req.flash('message')});
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/skills',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/signout', (req, res) =>{
  req.logout();
  res.redirect('/signin');
});

router.get('/signup', (req, res) =>{
    res.render('forms/register', {title: 'Sign up', user: req.user, message: req.flash('message')});
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => done(error, user));
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
  }, function (req, email, password, done) {
  User.findOne({email:email}, function(err, user) {
    if (err) return done(err);
    if (user) {
      return done(null, false, req.flash('message', 'Email is already taken.'));
    } else {
      var newUser = new User({
        username: req.body.username,
        email: email,
        password: password
      });
      User.createUser(newUser, function (err, user) {
        if (err) {
          return done(null, false, req.flash('message', 'Error adding creating your account.'));
        } else {
          return done(null, user);
        }
      });
    }
  });
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) =>{
  User.findOne({email:email}, (error, user) =>{
    if (error) return done(error);
    if (!user) {
      return done(null, false, req.flash('message', 'User doesn\'t exist.'));
    } else {
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, req.flash('message', 'Incorrect email/password.'));
        }
      });
    }
  });
}));
