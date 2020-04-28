const jwt = require('jsonwebtoken');
const keys = require("./../config/keys");

const withAuth = function(req, res, next) {
    let token;
    if (req.params.token && !req.cookies.token)
        token = req.params.token
    else
        token = req.cookies.token;
    if (!token) {
        res.status(400).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, keys.secretOrKey, async function(err, decoded) {
            if (err) {
                res.status(400).send('Unauthorized: Invalid token');
            } else {
                res.locals.id = decoded.id;
                next();
            }
        });
    }
};

module.exports = withAuth;