const stream = require('./api/Stream/DownloadTorrent.js');
const moviesData = require('./api/MovieInfos/MoviesInfos.js');
const interact = require('./api/Interactions/Actions.js');
const picture = require('./api/Interactions/Pictures.js');
const auth = require("./api/auth");
const withAuth = require('../utils/middleware');
const users = require("./api/users");
const router = require('express').Router();


module.exports = function factory(userslist) {
    // Define routes
    router.use ("/users", users);
    router.use ("/auth", auth);
    // Pictures
    router.post('/picture/add/:token', picture.upload.single('file'),  withAuth, picture.uploadPhoto);
    // Stream routes
    router.get('/movies/:stream/:quality/:imdbcode', withAuth, (req, res) => stream.getDataMovie(req, res, userslist))
    // Catch Movies route
    router.get('/movies/:id', moviesData.parseData);
    // Actions to a video
    router.get('/movies/:id/:action', withAuth, interact.Actions);
    // Get watchlist
    router.get('/watchlist', withAuth, interact.getWatchlist);
    // Get history
    router.get('/history', withAuth, interact.getHistory);
    // Get comment
    router.get('/infos/:id', withAuth, interact.getInfos);
    // Get user infos
    router.get('/users', withAuth, interact.getUserProfile);
    // Get user public infos
    router.get('/users/:username', withAuth, interact.getUserProfilePublic);
    // Delete comment
    router.get('/delete/comment/:imdbid/:id', withAuth, interact.deleteComment);
    router.post('/comment/:id', withAuth, interact.addComment)
    router.post('/user/update', withAuth, interact.updateInfos);

    return router;
}
