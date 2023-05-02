
const jwt = require("jsonwebtoken");
const {redisClient} = require("../Helper/redis");


const authenticator = async (req, res, next) => {

    try {
        const{token}= req.cookies

        
        if (!token) return res.status(401).send("Please login again");

        const isTokenValid = await jwt.verify(token, process.env.token);

        if (!isTokenValid) return res.send("Authentication failed, Please login again");

        const isTokenBlacklisted = await redisClient.get(token);

        if (isTokenBlacklisted) return res.send("Unauthorized");

        req.body.userId = isTokenValid.userId;
        req.body.city = isTokenValid.city;

      
        next()

    } catch (err) {
        res.send(err.message);
    }
};

module.exports = { authenticator };