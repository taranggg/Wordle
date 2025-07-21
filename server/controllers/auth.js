const User = require("../models/user");

exports.signin=async(req,res)=>{
    try {
        const {emailOrUsername,password}=req.body;
        const user=await User.findOne({
            $or:[{email:emailOrUsername},{username:emailOrUsername}]
        });
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({id:user._id},process.env.SECRET,{expiresIn:"24h"});
        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            token
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

exports.signup=async(req,res)=>{
    try {
        const {password}=req.body;
        const salt=await bcrypt.genSalt(12);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            ...req.body,
            password:hashedPassword,
        });
        const token=jwt.sign({id:user._id},process.env.SECRET,{expiresIn:"24h"});
        res.status(201).json({
            success:true,
            message:"User created successfully",
            token
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
