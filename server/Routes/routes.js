const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../Model/user')
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

router.post('/register', async(req,res) => {
    const {username, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/login', async (req,res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if (!user) return res.status(401).json({message: 'Invalid credentials'});

        const pswd = await bcrypt.compare(password, user.password);
        if(!pswd) return res.status(401).json({message: "Invalid Credentials"})

        const token= jwt.sign({id:'user._id'}, 'secret', {expiresIn:'1h'})
        res.json({token});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/languages', async (req,res) => {
    var endpoint = process.env.AZURE_TRANSLATOR_API_ENDPOINT;
    const header = req.header("Authorization");
    if (!header){
        return res.status(401).json({message: "Header is missing"});
    }
    const token = header.replace("Bearer ", "");
    try{
        const decode = jwt.verify(token, "secret");
        //res.status(201).json({message: "User Verified", id: decode.id});
        const response = await axios({
            method: 'GET',
            baseURL: endpoint,
            url: 'languages',
            params: {
              'api-version': '3.0',
            },
            headers: {
              'Content-type': 'application/json',
              'X-ClientTraceId': uuidv4().toString()
            },
            responseType: 'json'
        });
        res.json(response.data)
    }catch(err){
        //res.status(401).json({error: "Invalid token"});
        res.status(500).json({error: err.message});
    }
});

router.post('/translate', async (req,res) => {
    const {sourceLanguage, targetLanguage, originalText} = req.body;
    let key = process.env.AZURE_TRANSLATOR_API_KEY;
    let endpoint = process.env.AZURE_TRANSLATOR_API_ENDPOINT;
    let location = process.env.AZURE_TRANSLATOR_API_REGION;

    let params = new URLSearchParams();
    params.append("api-version", "3.0");
    params.append("from", sourceLanguage);
    params.append("to", targetLanguage);
    try{
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
            data: [{
                'text': originalText
            }],
            responseType: 'json'
        });
        res.json(response.data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.post('/translation-history', async(req,res) =>{
    let x=5;
})


module.exports = router;