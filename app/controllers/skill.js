import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
const Article = mongoose.model('Article');
// import Skill from '../models/Skill';

module.exports = (app) => {
  app.use('/skills', router);
};

router.get('/', (req, res) =>{
  res.render('skills/index', { title: 'Your skills', user: req.user});
});
