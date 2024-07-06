const mongoose = require('mongoose')

const translationSchema = new mongoose.Schema({
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    sourceLanguage: { type: String, required: true },
    targetLanguage: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
  
module.exports = mongoose.model('Translation', translationSchema);