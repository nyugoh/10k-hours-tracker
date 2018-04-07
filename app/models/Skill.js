import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  subject:{
    type: String,
    required: true,
    unique: true
  },
  hours: String,
  user: String,
  theme: String,
  goals: String
}, { timestamp: true });

module.exports = mongoose.model('Skill', skillSchema);
