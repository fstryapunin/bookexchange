const jwt = require("jsonwebtoken");
const { tokenKey } = require('../config');

const auth = (req, res, next) => {
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
        res.cookie('token', jRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 13 })
    }
    catch (err) {
        console.log(err)
        return res.status(401).send("Invalid Token");
    }
    
    return next()
}

module.exports = auth
