const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const cookie = require('cookie');
const keys = require("../config/keys");


const pushUserSocket = (socket, userslist, movieID) =>{
    // Get cookies
    if (socket.handshake.headers.cookie) {
        let cookief = socket.handshake.headers.cookie;
        if (cookief) {
            let cookies = cookie.parse(cookief);
            // Check Auth
            if (cookies && typeof cookies.token != "undefined") {
                jwt.verify(cookies.token, keys.secretOrKey, async (err, decoded) => {
                    if (!err) {
                        let id = decoded.id;
                        if (userslist && userslist.length < 1)
                            userslist.push({userID: id, socketID: socket.id, movieID: movieID});
                        else {
                            let find = false;
                            // Update socket ID associated with user ID
                            for (let i = 0; i < userslist.length; i++){
                                if (userslist[i].userID === id) {
                                    find = true;
                                    userslist[i].socketID = socket.id;
                                    userslist[i].movieID = movieID;
                                }
                            }
                            // If userID not find in tab, add it
                            if (!find) {
                                userslist.push({userID: id, socketID: socket.id, movieID: movieID});
                            }
                        }
                    }
                });
            }
        }
    }
    return userslist;
};

const deleteUserSocket = async(socket, userslist) => {
        // Get cookies
        let cookief = socket.handshake.headers.cookie;
        if (cookief) {
            let cookies = cookie.parse(cookief);
            // Check Auth
            if (cookies && typeof cookies.token != "undefined") {
                await jwt.verify(cookies.token, keys.secretOrKey, async (err, decoded) => {
                    if (!err) {
                        let id = decoded.id;
                        for (let i = 0; i < userslist.length; i++)
                            if (userslist[i].userID === id)
                                userslist.splice(i, 1);
                    }
                });
            }
        }
    return userslist;
};

exports.pushUserSocket = pushUserSocket;
exports.deleteUserSocket = deleteUserSocket;
