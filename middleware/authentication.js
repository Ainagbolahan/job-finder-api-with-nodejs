const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: 'Authorization header is missing'
        });
    };
    const parts = token.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send({
            message: 'Authorization header is invalid'
        });
    };
    // const auth = parts[0];
    const tokens = parts[1];
    const decoded = JWT.verify(tokens, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).send({
            message: 'Authorization header is invalid'
            });
    };

    req.user = decoded;

    // const user = {
    //     id: auth,
    //     tokens: tokens
    // };
    next();
};


module.exports = {verifyToken};

