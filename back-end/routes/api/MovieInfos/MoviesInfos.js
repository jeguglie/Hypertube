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

const checkYTSquality = (ytsInfo, quality) => {
    var correctQuality = false
        for (var index = 0; index < ytsInfo.length; index++) {
            if (ytsInfo[index].quality == quality) {
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
                        ytsInfo: [],
                        inLeet: false,
                        production_corp: res.data.production_companies,
                        production_country: res.data.production_countries,
                        subtitles: [],
                        leetInfo: []
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
            dataMovie.ytsInfo = inYTS.torrents
        }
        var isInLEET = await leetSearch(dataMovie.title)
        if (isInLEET) {
            dataMovie.inLeet = true
            dataMovie.leetInfo = isInLEET
        }
        var sub = await subtitles.getSubtitles(dataMovie.imdb_code)
        if (sub.en || sub.fr)
            dataMovie.subtitles = sub
        res.json(dataMovie);
    } catch (err) {
        // console.log(err)
    }
}

module.exports = { parseData, checkYTSquality }