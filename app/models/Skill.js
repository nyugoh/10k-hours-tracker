import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  subject:{
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  hours: String,
  user: String,
  theme: String,
  goals: String
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
