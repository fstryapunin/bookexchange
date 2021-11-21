const jwt = require("jsonwebtoken");
const { tokenKey } = require('../config');

const cookieAuth = (req, res, next) => {
    const token = req.cookies.token
    
    if (!token) {
        return res.status(403).send("No token");
    }
    try {
        const decoded = jwt.verify(token, tokenKey);
        req.user = decoded
        
        const jRefreshToken = jwt.sign(
            {
                email: decoded.email,
                id : decoded.id
            },
            tokenKey,
            {
              expiresIn: "30d",
            }
        );

      
        res.cookie('token', jRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 1 })       
        
        
    }
    catch (err) {
        console.log(err)
        return res.status(401).send("Expired Token");
    }
    
    return next()
}

const tokenAuth = (req, res, next) => {
    const token = req.body.token
    
    if (!token) {
        return res.status(403).send("No access token");
    }
    try {
        const decoded = jwt.verify(token, tokenKey);
        req.user = decoded       
    }
    catch (err) {
        console.log(err)
        return res.status(401).send("Expired access Token");
    }
    
    return next()
}

module.exports = {
    cookieAuth: cookieAuth,
    tokenAuth: tokenAuth
}
