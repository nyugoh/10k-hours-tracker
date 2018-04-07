import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
const Article = mongoose.model('Article');
import Skill from '../models/Skill';
import auth from '../../config/auth';

module.exports = (app) => {
  app.use('/skills', router);
};

router.use('/*', (req, res, next) =>{
  auth.isAuthenticated(req, res, next);
});

router.get('/', (req, res) =>{
  Skill.find({user: req.user._id}).sort({'createdAt': -1}).then(skills=>{
    res.render('skills/index', { title: 'Your skills', user: req.user, skills:skills});
  }).catch(error=> {
    res.status(404).json({message: error.message});
  });
});

router.post('/add', (req, res) =>{
  if(req.body) {
    let newSkill = new Skill(req.body);
    newSkill.user = req.user._id;
    newSkill.save().then(skill =>{
      res.json({status: 'OK'});
    }).catch(error =>{
      res.status(404).json({message: error.message});
    })
  } else {
    res.status(404).json({message: "Invalid skill."});
  }
});

router.get('/list', (req, res) =>{
  Skill.find({user: req.user._id}).sort({'createdAt': -1}).then(skills=>{
    res.json({skills});
  }).catch(error=>{
    res.status(404).json({message: error.message});
  });
});
