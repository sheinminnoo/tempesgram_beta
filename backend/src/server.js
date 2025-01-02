const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev')); // For logging
app.use(cors(
    {
        origin : "",
        credentials : true
    }
));

const PORT = process.env.PORT || 5000;
const MD_URL = process.env.MONGO_URL;   // MongoDB URL

mongoose.connect(MD_URL).then(()=>{
    try{
        console.log("MongoDB Connected");
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });   // Server is running

    }catch(err){    
        console.log(err);
    }
})

// routes

app.get('/',(req,res)=>{
    res.json({msg : "App server is running"});
});

const authRoutes = require('./routes/auth/authRoutes');
app.use('/api',authRoutes);

