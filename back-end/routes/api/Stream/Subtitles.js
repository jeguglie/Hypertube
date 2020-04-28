const OS        = require('opensubtitles-api');
const fs        = require('fs');
const strvtt    = require('srt-to-vtt');
const download  = require('download')

const OpenSubtitles = new OS({
    useragent:'TemporaryUserAgent',
    username: 'dilaouid',
    password: 'RHPXwqWzYwrEQ2eV'
});

const dir = './files/subtitles'

const readSub = (imdcode, lang, res) => {
    if (!fs.existsSync(`${dir}/${imdcode}/movie_${lang}.vtt`)) { return res.sendStatus(404) }
    fs.readFile(`${dir}/${imdcode}/movie_${lang}.vtt`, 'utf-8', (err, contents) => {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.write(contents)
        res.end()
        if (err) { console.log(err) }
    })
}

const convertVTT = (url, dirName, filename, lang) => {
    return new Promise( async (res) => {
        try {
            const data = await download(url, dir, {filename: filename + '_' + lang})
            if (!fs.existsSync(`${dir}/${dirName}`)) {
                fs.mkdirSync(`${dir}/${dirName}`)
            }

            fs.writeFileSync(`${dir}/${dirName}/${filename}`, data)
            fs.createReadStream(`${dir}/${dirName}/${filename}`)
                .pipe(strvtt())
                .pipe(fs.createWriteStream(`${dir}/${dirName}/${filename}_${lang}.vtt`))

            fs.unlink(`${dir}/${dirName}/${filename}`, (err) => {
                if (err) throw err
            })

            fs.unlink(`${dir}/${filename}_${lang}`, () => {
                const path = `${dir}/${dirName}/${filename}_${lang}.vtt`
                return res(path)
            })
        }
        catch(err) { console.log('An error occured during when converting the subtitles to a VTT format: ' + err) }
    })
}

const getSubtitles = (imdb_code) => {

    var frenchSub = false
    var engSub = false

    if (fs.existsSync(`${dir}/${imdb_code}/movie_fr.vtt`)) {
        frenchSub = true
    } if (fs.existsSync(`${dir}/${imdb_code}/movie_en.vtt`)) {
        engSub = true
    }

    if (!engSub || !frenchSub) {
        return new Promise( async (res) => {
            try {
                console.log('Looking for subtitles for' + ' (' + imdb_code + ')')
                const datasub = await OpenSubtitles.search({ imdbid: imdb_code })
                const subtitles = {}
                if (datasub.fr && !frenchSub) {
                    try {
                        console.log('found in french: ' + datasub.en.url)
                        const path = await convertVTT(datasub.fr.url, imdb_code, 'movie', 'fr')
                        subtitles.fr = path
                    }
                    catch(err) {
                        console.log('An error occured during when providing the subtitles: ' + err)
                        return null
                    }
                } else if (frenchSub) {
                    subtitles.fr = `${dir}/${imdb_code}/movie_fr.vtt`
                }
                if (datasub.en && !engSub) {
                    try {
                        console.log('found in english: ' + datasub.en.url)
                        const path = await convertVTT(datasub.en.url, imdb_code, 'movie', 'en')
                        subtitles.en = path
                    }
                    catch(err) { console.log('An error occured during when providing the subtitles: ' + err) }
                } else if (engSub) {
                    subtitles.en = `${dir}/${imdb_code}/movie_en.vtt`
                }
                if (!datasub.fr && !datasub.en) { console.log('No subtitles available for this movie... Or it has already been downloaded') }

                return res(subtitles)
            }
            catch(err) {
                console.log('An error occured during when providing the subtitles: ' + err)
                return null;
            }
        })
    } else {
        return ({ en: `${dir}/${imdb_code}/movie_en.vtt`, fr: `${dir}/${imdb_code}/movie_fr.vtt` })
    }
}

module.exports = { getSubtitles, readSub }