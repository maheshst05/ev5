const redisClient = require("../helpers/redis");

const redisLimiter = async (req,res,next) =>{

    const bool = await redisClient.exists(req.ip);

    if(bool === 1 ) {

        let no_request  = await redisClient.get(req.ip);
        no_request = +no_request;


        if(no_request<3) {
            redisClient.incr(req.ip);
            next();
        } else if(no_request===3) {
            redisClient.expire(req.ip,3600000);

            return res.send("Reached maximum request pleaes try again, after 1h")
        } else {

            return res.send("Reached maximum request pleaes try again, after 1h")
        }

    } else {
        redisClient.set(req.ip, 1);
        next()
    }

};

module.exports = redisLimiter;