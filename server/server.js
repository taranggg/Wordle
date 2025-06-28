const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const {connectDB}=require("./config/db");
const app=express();
dotenv.config({path:"./config/config.env"});
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Welcome to the Wordle API");
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
