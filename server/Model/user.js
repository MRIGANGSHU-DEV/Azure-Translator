const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:{ type:String, required:true },
  password: { type: String, required: true },
  translations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Translation' }]
});

module.exports = mongoose.model('User', userSchema);


