const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../keys.js");
const User = require("../models/User.js");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "You must be logged in",
        });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({
                error: "You must be logged in",
            });
        }

        const { _id } = payload;
        User.findById(_id).then((userData) => {
            req.user = userData;
        });
        next();
    });
};
