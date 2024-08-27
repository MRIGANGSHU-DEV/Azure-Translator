const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/routes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect("mongodb://localhost:27017/azure-translator").then(console.log("successfully connected to mongodb"))

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server connected to ${process.env.PORT}`);
})