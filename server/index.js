const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/routes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server connected to ${process.env.PORT}`);
})
