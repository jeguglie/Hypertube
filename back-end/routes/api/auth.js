const User = require("../../models/User");
const keys = require("../../config/keys");
const passport = require('passport')
, facebookStrategy = require('passport-facebook').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Config for localhost or production
const domain = process.env.NODE_ENV !== 'production' ? 'localhost' : 'hypertube.jv-g.fr';
const http = domain === 'localhost' ? 'http://' : 'https://';
const port = domain === 'localhost' ? `:${process.env.SERVER_PORT}` : '';
const port_front = domain === 'localhost' ? `:3001` : '';

const fbconfig = {
    facebook: {
        clientID: '641627723293057',
        clientSecret: 'c0d8618606f6efd23201999fc3def531',
        callbackURL: `${http}${domain}${port}/api/auth/facebook/callback`,
    }
};

passport.serializeUser(function(user, done) { done(null, user) });
passport.deserializeUser(function(obj, done) { done(null, obj) });

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

passport.use( new facebookStrategy({
    clientID: fbconfig.facebook.clientID,
    clientSecret: fbconfig.facebook.clientSecret,
    callbackURL: fbconfig.facebook.callbackURL,
    profileFields: [ 'id', 'email', 'name', 'picture.type(large)' ]
},

    function (accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, (err, data) => {
            if (err) { return done(err) }
            if (data) {
                return done(err, data);
            }
            else {
                if (!profile._json.email) {
                    return done(err)
                }
                var logUser = new User({
                    email: profile._json.email,
                    firstname: profile._json.first_name ? profile._json.first_name : '',
                    lastname: profile._json.last_name ? profile._json.last_name : '',
                    username: profile.id,
                    img: profile.photos[0].value ? profile.photos[0].value : '',
                    oauthID: profile.id,
                    active: 1,
                    facebook: profile._json ? profile._json : {}
                });
                logUser.save( (err) => {
                    if (err) { console.log(err) }
                    return done(err, logUser)
                })
            }
        })
    }
));


passport.use( new FortyTwoStrategy({
    clientID: '75607f7c0cffbc57db66d160efd1c4ef5d7b2ce7ae0ef4697efae1892a9bcb6a',
    clientSecret: '73cdf3a9a369e87333d87e6cd80f5eac124d339d4265e1317ac11753782eb35e',
    callbackURL: `${http}${domain}${port}/api/auth/42/callback`
  },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, (err, data) => {
            if (err) { return done(err) }
            if (data) {
                return done(err, data);
            }
            else {
                var logUser = new User({
                    email: profile._json.email,
                    firstname: profile._json.first_name ? profile._json.first_name : '',
                    lastname: profile._json.last_name ? profile._json.last_name : '',
                    username: `${profile._json.login}_${new Date().getTime()}`,
                    img: profile._json.image_url,
                    oauthID: profile.id,
                    active: 1,
                    42: profile._json ? profile._json : {}
                });
                logUser.save( (err) => {
                    if (err) { console.log(err) }
                    return done(err, logUser)
                })
            }
        })
  }
));





router.get('/42', passport.authenticate('42'));

router.get('/42/callback',
passport.authenticate('42', { failureRedirect: `${http}${domain}${port_front}/login` }),
    function(req, res) {
        User.findOne({ oauthID: req.user.oauthID }).then(async(user) => {
            if (!user) { return res.status(400).json({}); }
            const payload = { id: user.id };
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 },
                (err, token) => {
                    if (!err) {
                        res.header('Access-Control-Allow-Credentials', true);
                        if (process.env.NODE_ENV === 'production') {
                            res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, secure: true, sameSite: false, httpOnly: false });
                            res.cookie('language', user.language, { maxAge: 2 * 60 * 60 * 1000, sameSite: false, secure: true, httpOnly: false });
                        }
                        else {
                            res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, secure: false, httpOnly: false });
                            res.cookie('language', user.language, { maxAge: 2 * 60 * 60 * 1000, secure: false, httpOnly: false });
                        }
                        res.redirect(`${http}${domain}${port_front}`);
                    }
                    console.log(err);
                    return res.status(400).json({});
                }
            )
        });
});


router.get('/facebook', passport.authenticate('facebook', { scope: ["public_profile", "email"] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${http}${domain}${port_front}/login`, scope: ["public_profile", "email"] }), (req, res) => {
    User.findOne({ oauthID: req.user.oauthID }).then(async(user) => {
        if (!user) { return res.status(400).json({}); }
        const payload = { id: user.id };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 },
            (err, token) => {
                if (!err) {
                    res.header('Access-Control-Allow-Credentials', true);
                    if (process.env.NODE_ENV === 'production') {
                        res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, secure: true, sameSite: false, httpOnly: false });
                        res.cookie('language', user.language, { maxAge: 2 * 60 * 60 * 1000, sameSite: false, secure: true, httpOnly: false });
                    }
                    else {
                        res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, secure: false,  httpOnly: false });
                        res.cookie('language', user.language, { maxAge: 2 * 60 * 60 * 1000, secure: false, httpOnly: false });
                    }
                    res.redirect(`${http}${domain}${port_front}`);
                }
                console.log(err)
                return res.status(400).json({});
            }
        )
    });
})

module.exports = router;