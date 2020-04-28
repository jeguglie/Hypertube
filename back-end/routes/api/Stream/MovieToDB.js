
const mongoose      = require('mongoose');
const db            = mongoose.connection;
const schema        = require('../../../models/MovieSchema.js')
const user          = require('../../../models/User.js')
const fs            = require('fs');
const unixDate = new Date();
const currentDate = unixDate.getFullYear() + '-' + ( unixDate.getMonth() + 1 ) + '-' + unixDate.getDate();

const deleteOldMovies = async () => {
    try {
        var checkDate = unixDate
        checkDate.setMonth(checkDate.getMonth() - 1)
        var deleteDate = checkDate.getFullYear() + '-' + ( checkDate.getMonth() +1 ) + '-' + ( checkDate.getDate() );

        Movie.find({lastView: {$lt: deleteDate}}, (err, data) => {
            if (!data || err) { return; }
            for (let index = 0; index < data.length; index++) {
                for (let j = 0; j < data[index].path.length; j++) {
                    if (data[index].path[j].path) { fs.unlinkSync(data[index].path[j].path) }
                }
            }
        })

        Movie.updateMany({
            lastView: {$lt: deleteDate},
            downloaded: {
                $elemMatch: {
                    state: true
                }
            }
        }, {
            $set: {
                'downloaded.$.state': false,
                path: []
            }
        }, (err, data) => {
            if (err) { console.log(err) }
        })
    } catch (err) { console.log(err) }
}

const setDownloadedMovie = (magnet, moviePath, movieInfos, req) => {
    var imdb_code = movieInfos.imdb_code
    Movie.findOne({ imdb_code: imdb_code }, (err, data) => {
        var notDownloaded = { type: req.params.stream, magnet: magnet, quality: req.params.quality, state: false }
        for (let index = 0; index < data.downloaded.length; index++) {
            if (JSON.stringify(notDownloaded) === JSON.stringify(data.downloaded[index])) {
                data.downloaded.splice(index, 1, { type: req.params.stream, magnet: magnet, quality: req.params.quality, state: true })
                data.path.push({ magnet: magnet, path: moviePath })
                data.save( (err) => {
                    if (err) { console.log('cannot update the movie statut, error: ' + err) }
                    else { console.log('the movie is now set as downloaded!') }
                })
            }
        }
        if (err) { console.log(err) }
    })
}

const addMovietoDB = async (req, movieInfos, magnet, userID) => {
    var imdb_code = movieInfos.imdb_code
    try {

        var notDownloaded = { type: req.params.stream,
                              magnet: magnet,
                              quality: req.params.quality,
                              state: false }

        var addMovie = new Movie({
            imdb_code:   imdb_code,
            downloaded: notDownloaded,
            userViews: [ userID ]
        })

        addMovie.save( (err) => { console.log(err) })

    } catch (err) { console.log(err) }
}

const addViews = (imdbcode, userID) => {
    var currentTimestamp = Math.round(unixDate.getTime() / 1000);
    try {
        Movie.findOne({imdb_code: imdbcode}, (err, data) => {
            if (!data)
                return;
            if (err) {
                console.log(err)
            } else if (userID && !data.userViews.includes(userID)) {
                data.userViews.push(userID)
            }
            if (data) {
                data.lastView = currentTimestamp
                data.save((err) => {
                    console.log(err)
                })
            }
        })
        User.findById(userID, (err, data) => {
            let exists = false
            if (!data)
                return;
            for (let index = 0; index < data.history.length; index++) {
                if (data.history[index].imdbcode == imdbcode) {
                    data.history[index].date = currentTimestamp
                    exists = true
                    break;
                }
            }
            if (!exists) {
                let newElem = {imdbcode: imdbcode, date: currentTimestamp}
                data.history.push(newElem)
            }
            data.save((err) => {
                console.log(err)
            })
        })
    } catch (err) {
        console.log('error MovieToDB.addViews', err)
        return;
    }
}

module.exports = { addViews, addMovietoDB, setDownloadedMovie, deleteOldMovies }
