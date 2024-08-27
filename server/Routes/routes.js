const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
const Translation = require('../Model/translation');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to authenticate token and set req.user
const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        req.user = user;
        next(); // Pass control to the next handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const pswd = await bcrypt.compare(password, user.password);
        if (!pswd) return res.status(401).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get all the languages
router.get('/languages', authenticateToken, async (req, res) => {
    try {
        const response = await axios({
            method: 'GET',
            baseURL: process.env.AZURE_TRANSLATOR_API_ENDPOINT,
            url: 'languages',
            params: { 'api-version': '3.0' },
            headers: {
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            responseType: 'json'
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to translate text
router.post('/translate', authenticateToken, async (req, res) => {
    const {sourceLanguageShort,targetLanguageShort, originalText, sourceLanguageFull, targetLanguageFull } = req.body;
    let key = process.env.AZURE_TRANSLATOR_API_KEY;
    let endpoint = process.env.AZURE_TRANSLATOR_API_ENDPOINT;
    let location = process.env.AZURE_TRANSLATOR_API_REGION;

    let params = new URLSearchParams();
    params.append("api-version", "3.0");
    params.append("from", sourceLanguageShort);
    params.append("to", targetLanguageShort);

    try {
        const response = await axios({
            method: 'POST',
            baseURL: endpoint,
            url: '/translate',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: params,
            data: [{ 'text': originalText }],
            responseType: 'json'
        });

        const translatedText = response.data[0].translations[0].text;

        // Saving the translation history
        const translation = new Translation({ originalText, translatedText, sourceLanguage: sourceLanguageFull, targetLanguage: targetLanguageFull, user: req.user.id });
        await translation.save();

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get translation history
router.get('/translation-history', authenticateToken, async (req, res) => {
    try {
        const translations = await Translation.find({ user: req.user.id });
        res.json(translations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
