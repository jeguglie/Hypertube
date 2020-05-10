const axios     = require('axios');
const xtorrent  = require('xtorrent');
const subtitles = require('../Stream/Subtitles.js')
const apiKey    = 'f29f2233f1aa782b0f0dc8d6d9493c64'

/************************************************/
/* // TRES IMPORTANT !!!!!!! \\\\\\\\\\\\\\\\\\\*/
/*      Quand tu vas faire                      */
/*--------------------------------------------- */
/** npm install xtorrent --save *               */
/*----------------------------------------------*/
/*                                              */
/*   Va dans node_modules/xtorrent/index.js     */
/*   ligne 9, remplace 1337x.to par 1377x.to !! */
/*   1337x.to n'existe plus lol                 */
/*----------------------------------------------*/
/************************************************/

const timeConverter = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

const checkYTSquality = (infoYTS, quality) => {
    var correctQuality = false
        for (var index = 0; index < infoYTS.length; index++) {
            if (infoYTS[index].quality == quality) {
                correctQuality = true
                break;
            }
        }
        if (correctQuality == false)
            res.sendStatus({res: 'no'});
        res.json({res: 'yes'});
}

const createInstance = async (baseUrl, type) => {
    try {
        let instance = axios.create({
            baseURL: baseUrl,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
        });
        return instance.get()
        .then((res => {
            switch(type) {
                case 'yts': {
                    if (res.data.data.movies == undefined)
                        return null
                    return res.data.data.movies[0]
                }
                case 'imdb': {
                    if (res == undefined || res.data.imdb_id == null)
                        return null
                    var data = {
                        imdb_code: res.data.imdb_id,
                        title: res.data.title,
                        original_language: res.data.original_language,
                        inYTS: false,
                        in1377: false,
                        torrentInfos: { infoYTS: [], info1377: [] },
                        prod: {production_corp: res.data.production_companies, production_country: res.data.production_countries},
                        subtitles: [],
                        HypeerTube: {views: 0, likes: 0, downloaded: false, comments: Array()}
                    };
                    return data
                }
                default: {
                    console.log('Wrong type, please choose between [imdb, yts]')
                }
            }
        }))
    } catch (err) { return null }
}

const catchQuality = (quality, string) => {
    return string.includes(quality)
}

const catchQualityType = (url) => {
    var type = ['hdtv', 'bluray', 'bdrip', 'tvrip', 'dvdrip', 'hdlight', 'dvd-r']
    var lowerurl = url.toLowerCase()
    for (let index = 0; index < type.length; index++) {
        if (lowerurl.includes(type[index]))
            return type[index]
    }
    return null
}

const getLeetMagnet = async(link) => {
    return xtorrent
        .info('http://1377x.to' + link)
        .then(data => {
            return data
        })
        .catch(err => {
            // console.log(err)
        })
}

const leetSearch = async (movieTitle) => {
    var fhd = false
    var hd = false
    var arr = [];
    var magnet = undefined
    return xtorrent
        .search({
            query: movieTitle,
            category: 'Movies',
            orderBy: 'seeders',
            sortBy: 'desc',
            page: 1
        })
        .then(async (data) => {
            for (element of data.torrents) {
                if (catchQuality('720', element.title) && element.seed > 0 && !hd) {
                    magnet = await getLeetMagnet(element.href)
                    var type = catchQualityType(element.href)
                    var hdElements = {url: 'http://1377x.to' + element.href, quality: '720p', type: type, seeds: parseInt(element.seed), leech: parseInt(element.leech), size: element.size, magnet: magnet.download.magnet}
                    arr.push(hdElements)
                    hd = true
                } else if (catchQuality('1080', element.title) && element.seed > 0 && !fhd) {
                    magnet = await getLeetMagnet(element.href)
                    var type = catchQualityType(element.href)
                    var fhdElements = {url: 'http://1377x.to' + element.href, quality: '1080p', type: type, seeds: parseInt(element.seed), leech: parseInt(element.leech), size: element.size, magnet: magnet.download.magnet}
                    arr.push(fhdElements)
                    fhd = true
                }
            }
            if (!fhd && !hd) {
                return null
            }
            return arr
        })
        .catch(err => {
            // console.log(err)
        })
}

const parseData = async (req, res) => {
    let idMovie = req.params.id;
    try {
        var baseURL_imdb = `https://api.themoviedb.org/3/movie/${idMovie}?api_key=${apiKey}`
        var dataMovie = await createInstance(baseURL_imdb, 'imdb')
        if (dataMovie == null) { return res.sendStatus(404) }

        var baseURL_yts = `https://cors-anywhere.herokuapp.com/yts.mx/api/v2/list_movies.json?query_term=${dataMovie.imdb_code}`
        var inYTS = await createInstance(baseURL_yts, 'yts')
        if (inYTS != null) {
            dataMovie.inYTS = true
            dataMovie.torrentInfos.infoYTS = inYTS.torrents
        }
        var isin1377 = await leetSearch(dataMovie.title)
        if (isin1377) {
            dataMovie.in1377 = true
            dataMovie.torrentInfos.info1377 = isin1377
        }
        var sub = await subtitles.getSubtitles(dataMovie.imdb_code)
        if (sub.en || sub.fr)
            dataMovie.subtitles = sub
        var getMovieDB = await Movie.findOne({ imdb_code: dataMovie.imdb_code })
        if (getMovieDB) {
            dataMovie.HypeerTube.views = getMovieDB.userViews.length
            dataMovie.HypeerTube.likes = getMovieDB.like.length
            var alreadyDL = false
            if (getMovieDB.downloaded.length > 0) {
                for (let i = 0; i < getMovieDB.downloaded.length; i++) {
                    if (getMovieDB.downloaded[i].state === true)
                    alreadyDL = true;
                }
            }
            var comments = Array()
            dataMovie.HypeerTube.downloaded = alreadyDL
            for (let j = 0; j < getMovieDB.comments.length; j++) {
                let addComment = {user: getMovieDB.comments[j].user, comment: getMovieDB.comments[j].comment, date: timeConverter(getMovieDB.comments[j].date)}
                comments.push(addComment)
            }
            dataMovie.HypeerTube.comments = comments
        }
        res.json(dataMovie);
    } catch (err) {
        // console.log(err)
    }
}

module.exports = { parseData, checkYTSquality }