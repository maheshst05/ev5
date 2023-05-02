const express =  require("express")
const app = express()
app.use(express.json())

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const logger = require("./middlewares/logger");
const { connection } = require("./db")

const {userRoutes} = require("./Routes/userRouts")

app.use("/api/user",userRoutes)
app.get("/",async(req,res)=>{
    await res.send("welcome.")
})


//server
app.listen(9090,async()=>{
    await connection
    
    logger.log("info","Database connected")
    console.log("server is runing.")
})





