const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  Article.find((err, articles) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles,
      appName: process.env.APP_NAME
    });
  });
});

router.get('/login', (req, res) =>{
  res.render('forms/login', {title: 'Login Page'});
});

router.get('/register', (req, res) =>{
  res.render('forms/register', {title: 'Sign up'});
});
