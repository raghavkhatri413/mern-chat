const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
const User=require('./models/user');
const cors=require('cors');

dotenv.config();
async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.log('Error connecting to MonogDB:',err.message);
        console.error('Connection String:', process.env.MONGO_URL);
        process.exit(1);
    }
}
connectDB();
const jwtSecret=process.env.JWT_SECRET;
const app=express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))

app.get('/test',(req,res)=>{
    res.json('test ok');
});


app.post('/register',async (req,res)=>{
    try{
        const{username,password}=req.body;
        const createdUser=await User.create({username,password});
        jwt.sign({userId:createdUser._id},jwtSecret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).status(201).json('ok');
        });
    }
    catch(err){
        console.log('Register error',err);
        res.status(500).json({error:'Internal server error'});
    }
});

app.listen(4040);

//khatriraghav14
//ABoKBl7jmsborLbm