const express = require("express")
const { userModel } = require("../Model/userModel")
const userRoutes = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { redisClient } = require("../Helper/redis")

const { authenticator }  = require("../middleware/authentication")

require("dotenv").config()
 //register
userRoutes.post("/signup",async(req,res)=>{
let { name,email,password } = req.body 
    try {
        const user = await userModel.find({email})

        if(user.length>0)return res.send("user is already presend plz login.")

        const hash = bcrypt.hash(password,5)

        const newuser = new userModel({name,email,password:hash})
        await newuser.save()
        res.send("user is login succesfully") 
        
    } catch (error) {
        res.send(error.message)
    }
})
//login
userRoutes.post("/login",async(req,res)=>{
const { email,password } =  req.body
    try {
        
        const userisPresent =  await userModel.findOne({email})
        
        if(!userisPresent) return res.send("user is not present plz signup")
  const passwordisCorrect = await bcrypt.compare(password,userisPresent.password)
       if(!passwordisCorrect) return res.send("passwor is not correct")
    const token = await jwt.sign({userId:userisPresent._id},process.env.token,{expiresIn:"1h"})

    res.cookie("token",token,{maxAge:60*10000})

    res.send("login succesfully")

} catch (error) {
        res.send(error.message)
    }
})

//logout
userRoutes.get("/logout",authenticator,async(req,res)=>{

try {
        
const {token } = req.cookies

if(!token) return res.status(403)

await redisClient.set(token,token)
res.send("logout succesfully")

} catch (error) {
        res.send(error.message)
    }
})

module.exports={
    userRoutes
}