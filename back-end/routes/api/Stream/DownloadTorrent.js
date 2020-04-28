const axios         = require('axios');
const stream        = require('./Stream.js')
const key           = require('../../../config/keys.js')

const udpYTS = [
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.openbittorrent.com:80',
    'udp://tracker.coppersurfer.tk:6969',
    'udp://glotorrents.pw:6969/announce',
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://torrent.gresille.org:80/announce',
    'udp://p4p.arenabg.com:1337',
    'udp://tracker.leechers-paradise.org:6969'
]

async function axiosQuery(baseURL, type) {
    try {
        const instance = axios.create({
            baseURL: baseURL,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
            });
        return instance.get()
        .then((res => {
            switch (type) {
                case 'imdb_id':
                    if (res.data.movie_results[0].id == undefined)
                        return null
                    return res.data.movie_results[0].id
                case 'leet':
                    if (res.data.inLeet == true)
                        return res.data
                    return null
                case 'yts':
                    if (res.data.data.movies == undefined)
                        return null
                    return res.data.data.movies[0]
                default:
                    console.log('wrong parameter (' + type + ') for axiosQuery')
            }
        }))
    } catch (error) { console.error(error) }     
}

const URLmagnetYTS = (hash, title) => {
    return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=${udpYTS.join('&tr=')}`
}

const checkQuality1377 = (leetinfos, quality) => {
    for (let index = 0; index < leetinfos.length; index++) {
        if (quality == leetinfos[index].quality)
            return index
    }
    return false
}

const printLeet = async (req, res, quality, imdbcode, userslist) => {
    try {
        console.log('Source: 1377')
        var urlID = `https://api.themoviedb.org/3/find/${imdbcode}?api_key=${key.apiIMDB}&external_source=imdb_id`
        var imdbID = await axiosQuery(urlID, 'imdb_id')
        if ( !imdbID )
            return res.sendStatus(404)
        var restReq = await axiosQuery(process.env.NODE_ENV !== 'production' ? `http://localhost:${process.env.SERVER_PORT}/api/movies/` : 'https://hypertube.jv-g.fr/api/movies/' + imdbID, 'leet');
        var quality = checkQuality1377(restReq.leetInfo, quality)
        if ( !restReq || quality === false)
            return res.sendStatus(404)
        var magnetLink = restReq.leetInfo[quality].magnet
        stream.initStreaming(req, res, magnetLink, restReq, res.locals.id, imdbID, userslist)
    } catch (err) { return res.sendStatus(203) }
}

const printYTS = async (baseURL, req, res, quality, userslist) => {
    try {
        console.log('Source: YTS')
        var urlID = `https://api.themoviedb.org/3/find/${req.params.imdbcode}?api_key=${key.apiIMDB}&external_source=imdb_id`
        var imdbID = await axiosQuery(urlID, 'imdb_id')
        if ( !imdbID )
            return res.sendStatus(404)
        var movie = await axiosQuery(baseURL, 'yts');
        if (movie != null) {
            var correctQuality = false
            for (var index = 0; index < movie.torrents.length; index++) {
                if (movie.torrents[index].quality == quality) {
                    correctQuality = true
                    break;
                }
            }
            if (correctQuality == false)
               res.sendStatus(404);
            var magnet = URLmagnetYTS(movie.torrents[index].hash, movie.title_long)
            stream.initStreaming(req, res, magnet, movie, res.locals.id, imdbID, userslist)
        }
        else
            return res.sendStatus(404)
    } catch (error) { return res.sendStatus(203) }
}

const getDataMovie = (req, res, userslist) => {
    const paramStream = req.params.stream
    const quality     = req.params.quality + 'p'
    var imdbcode      = req.params.imdbcode

    if (paramStream == 'yts') {
        printYTS(`https://cors-anywhere.herokuapp.com/yts.mx/api/v2/list_movies.json?query_term=${req.params.imdbcode}`, req, res, quality, userslist)
    } else if (paramStream == '1377') {
        printLeet(req, res, quality, imdbcode, userslist)
    } else {
        return res.sendStatus(404)
    }
}

module.exports = { getDataMovie, axiosQuery }