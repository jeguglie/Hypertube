require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const express = require('express')
const app = express();
const path = require('path');
const server = require('http').createServer();
const socketFunctions = require('./utils/socketFunctions');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const db = require("./config/keys").mongoURI;
const router = require('./routes/router');

const io = require('socket.io')(server, {
    path: '/',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true
});
require("./config/passport")(passport);
// Connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('DB Connected!'))
    .catch(err => { console.log(`DB Connection Error: ${err.message}`) });

app.use(helmet());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded( { extended: false }) );
app.use(bodyParser.json());
app.use(passport.initialize());

// Sockets
let userslist = [];
io.sockets.on('connection', async(socket) => {
    if (socket.handshake.headers.cookie) {
        userslist = await socketFunctions.pushUserSocket(socket, userslist, '');
        socket.on('stream:play', async (movieID) => {
            userslist = await socketFunctions.pushUserSocket(socket, userslist, movieID);
        });
        socket.on('stream:unmount', async () => {
            userslist = await socketFunctions.deleteUserSocket(socket, userslist);
        });
        socket.on('disconnect', async () => {
            userslist = await socketFunctions.deleteUserSocket(socket, userslist);
        });
    }
});

// Deserve gzip
app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

if (process.env.NODE_ENV === 'production') {
    console.log(process.env.NODE_ENV === 'production' ? 'Server serve ../front-end/build' : 'Server dev' );
    app.use(express.static(path.resolve(__dirname, '../front-end/build/')))
}


app.use('/api/subtitles', express.static('files/subtitles'));
app.use('/public', express.static('public'));
app.use('/api', router(userslist));


// All remaining requests return the React app, so it can handle routing.
if (process.env.NODE_ENV === 'production') {
    console.log(process.env.NODE_ENV === 'production' ? 'Server redirect * except /api on ../front-end/build/' : 'Server dev' );
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../front-end/build/', 'index.html'));
    })
}

app.listen(process.env.SERVER_PORT, () => console.log(`Server has started on port ${process.env.SERVER_PORT}`));
server.listen(process.env.SOCKET_PORT, () => console.log(`Server has started on port ${process.env.SOCKET_PORT}`));
