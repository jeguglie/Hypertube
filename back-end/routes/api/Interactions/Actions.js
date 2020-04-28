const mongoose          = require('mongoose');
const db                = mongoose.connection;
const jwt               = require('jsonwebtoken');
const key               = require('../../../config/keys.js');
const bcrypt            = require("bcryptjs");
const Watchlist         = require('../../../models/WatchList.js');
const User              = require('../../../models/User.js');
const Movie             = require('../../../models/MovieSchema.js');
const axios             = require('axios');
const sanitize          = require('mongo-sanitize');
const Validator         = require("validator");
const passwordValidator = require('password-validator');

var schema = new passwordValidator();
schema
.is().min(8)
.is().max(30)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().symbols()

///////////////////////////////////////////
// COMMENT GESTION
const addComment = async(req, res) => {
    let currentTimestamp = Math.round((Date.now() / 1000))
    let comment = sanitize(req.body.comment)
    let username = '';
    let imdbid = sanitize(req.params.id);
    let userID = res.locals.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`


    if (!userID) { return res.status(403).json({}) }
    

    let imdbcode = await createInstance(urlID, false);
    if (!imdbcode) { return res.status(404).json({}) }


    try {
        const user = await User.findById(userID)
        if (!user)
            throw new Error ('error data');
        username = user.username;
        if ( !comment || comment && (comment.length < 8 || comment.length > 130) )
            return res.status(405).json({});

            var data = await Movie.findOne({imdb_code: imdbcode});
            if (!data) {
                let addMovie = new Movie({
                    imdb_code:   imdbcode,
                    userViews: [ userID ]
                })
                addMovie.save( (err) => { console.log(err) })
                data = await Movie.findOne({imdb_code: imdbcode});
            }
            let id;
            if (data.comments.length == 0) { id = 1; }
            else { id = Math.max(...data.comments.map(o => o.id), 0) + 1; }
            var newComment = {id: id, user: username, userID: userID, comment: comment, date: currentTimestamp, img: user.img};
            data.comments.push(newComment);
            data.save((err) => { if (err) return res.status(403).json({})})
    } catch(err) {
        console.log(err)
        return res.status(403).json({})
    }
    return res.status(200).json({newComment})
}

const deleteComment = async (req, res) => {

    let imdbid = sanitize(req.params.imdbid);
    var id = sanitize(req.params.id);
    let userID = res.locals.id;
    var deleted = false;
    if (!userID) { return res.status(403).json({}) }

    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
    let imdbcode = await createInstance(urlID, false)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let dataUsers = await User.findById({_id: userID})
        if (!dataUsers) { throw new Error ('No users found with this ID: ', userID); }
        var username = dataUsers.username
    } catch (err) {  console.log(err, 2); res.status(403).json({}) }

    try {
        let dataMovies = await Movie.findOne({imdb_code: imdbcode})
        if (!dataMovies) { throw new Error ('No movie found with this imdbcode: ', imdbcode); }
        for (let index = 0; index < dataMovies.comments.length; index++) {
            console.log(username);
            if (dataMovies.comments[index].user == username && dataMovies.comments[index].id == id) {
                dataMovies.comments.splice(index, 1)
                deleted = true;
                dataMovies.save( (err) => { if (err) { console.log(err) } })
                break ;
            }
        }
    } catch (err) { console.log(err, 1);res.status(403).json({}) }

    if (deleted) { return res.status(200).json({})}
    else {
        return res.status(404).json({})
    }

};

const getInfos = async (req, res) => {
    let commentsList = [];
    let imdbid = sanitize(req.params.id);
    var userID = res.locals.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
    let imdbcode = await createInstance(urlID, false)
    var username = '';

    if (userID) {
        var getUserInfos = await User.findById(userID)
        if (getUserInfos)
            username = getUserInfos.username
    }

    if (!imdbcode) { return res.status(404).json({}) }
    try {
        var dataMovies = await Movie.findOne({ imdb_code: imdbcode })
        if (!dataMovies) {
            let addMovie = new Movie({
                imdb_code: imdbcode
            })
            addMovie.save( (err) => { console.log(err) })
            dataMovies = await Movie.findOne({imdb_code: imdbcode});
            return res.status(200).json({userID: userID, username: username, commentsList: [], views: 1})
        }
        const arrayViews = dataMovies.views.filter(user => user === username);
        if (!arrayViews.length) {
            dataMovies.views.push(username);
            dataMovies.save((err) => { console.log(err) })
        }
        if (dataMovies && dataMovies.comments) {
            let comments = dataMovies;
            commentsList = comments.comments.sort((a, b) => {
                return a.date - b.date;
            });
            for (var i = 0; i < commentsList.length; i++){
               let user = await User.findOne({_id: commentsList[i].userID})
                if (user) {
                    commentsList[i].user = user.username;
                    commentsList[i].avatar = user.img;
                }
            }
        }
        return res.status(200).json({userID: userID, username: username, commentsList: commentsList, views: dataMovies.views.length})
    } catch (err) { console.log(err); res.status(403).json({}) }
}
///////////////////////////////////////////
///////////////////////////////////////////

const getUserProfile = async (req, res) => {
    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }
    try {
        console.log(userID);
        var infoUsers = await User.findById(userID)
        if (!infoUsers) { return res.status(404).json({}) }
        var infos = { username: infoUsers.username, firstname: infoUsers.firstname, lastname: infoUsers.lastname, img: infoUsers.img, email: infoUsers.email }
        return res.status(200).json(infos)
    } catch (err) { console.log(err); res.status(403).json({}) }
}

const getUserProfilePublic = async (req, res) => {
    let username = sanitize(req.params.username)
    try {
        var infoUsers = await User.findOne({username: username})
        if (!infoUsers) { return res.status(404).json({}) }
        var GetWatchListUser = await Watchlist.findOne({user_id: infoUsers._id})
        let watchListUser = GetWatchListUser && GetWatchListUser.movies? GetWatchListUser.movies : '';
        var infos = { username: infoUsers.username, firstname: infoUsers.firstname, lastname: infoUsers.lastname, img: infoUsers.img, history: infoUsers.history, watchlist: watchListUser }
        return res.status(200).json(infos)
    } catch (err) { console.log(err); res.status(403).json({}) }
}

const updateInfos = async (req, res) => {

    let userID      = res.locals.id;

    if (!userID) { return res.status(403).json({}) }

    // we sanitize everything so we avoid NoSQL injections
    let email       = sanitize(req.body.email)
    let username    = sanitize(req.body.username)
    let firstname   = sanitize(req.body.firstname)
    let lastname    = sanitize(req.body.lastname)
    let img         = req.body.defaultImg;
    let editPassword = req.body.editPassword;

    var errors      = {}

    let password        = sanitize(req.body.password)
    let confirmpass     = sanitize(req.body.passwordconfirm)


    // check if the entries are valid
    if (editPassword) {
        if (password && !schema.validate(password)) errors.password = "Password must contain at least one uppercase, one number and one symbol, and at least 8 characters."
        if (password && confirmpass && !Validator.equals(password, confirmpass)) errors.password_confirm = "Passwords must match"
    };


    if ( email && !Validator.isEmail(email) ) { errors.email = "Email is invalid" }

    if (errors.length > 0) { return res.status(405).json(errors) }

    try {
        // Check if entries already exists in the database
        let getExistingUsernameFromId = await User.findOne({_id: userID})
        let getExistingUsername = await User.findOne({username: username})

        if (!getExistingUsernameFromId) { return res.status(404).json({}) }

        if (getExistingUsername && getExistingUsername.username !== getExistingUsernameFromId.username) {
            errors.username = "Username already taken by another user"
            return res.status(400).json(errors)
        }
        let getExistingEmail = await User.findOne({email: email})
        if (getExistingEmail && email !== getExistingUsernameFromId.email){
            errors.email = "Email address already taken by another user"
            return res.status(400).json(errors)
        }

        // update infos here
        if (editPassword && password && confirmpass) {
           await bcrypt.genSalt(10, async(err, salt) => {
                await bcrypt.hash(password, salt, async(err, hash) => {
                    getExistingUsernameFromId.password = hash;
                });
            });
        }

        if (username && getExistingUsernameFromId && !getExistingUsernameFromId.oauthID) {  getExistingUsernameFromId.username = username }
        if (firstname) {  getExistingUsernameFromId.firstname = firstname }
        if (lastname) {  getExistingUsernameFromId.lastname = lastname }
        if (email) {  getExistingUsernameFromId.email = email }
        if (img) {  getExistingUsernameFromId.img = 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png' }

        await  getExistingUsernameFromId.save((err) => { if (err) return res.status(403).json({})})

        ////////
        return res.status(200).json({username: false})
        
    } catch (err) { console.log(err); res.status(403).json({}) }

}


const createInstance = async (baseUrl, option) => {
    try {
        let instance = axios.create({
            baseURL: baseUrl,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
        });
        return instance.get()
            .then((res => {
                if (res.status === 200 && res.data && res.data.id && res.data.imdb_id) {
                    return option ? res.data.id : res.data.imdb_id
                }

            }))
    } catch (err) { return null }
}

// Valeur à mettre: imdbid
const likeInteraction = async (req, res) => {
    let imdbid = sanitize(req.params.id);
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }

    let imdbcode = await createInstance(urlID, false)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let dataMovies = await Movie.findOne({ imdb_code: imdbcode })
        if (!dataMovies) { throw new Error ('No movie found with this imdbcode: ', imdbcode); }
        if (!dataMovies.like.includes(userID))
            dataMovies.like.push(userID);
        else
            dataMovies.like = dataMovies.like.filter(like => like != userID)
        dataMovies.save((err) => { if (err) return res.status(403).json({})})
        return res.status(200).json({})
    } catch (err) { res.status(403).json({}) }
}


// Valeur à mettre = imdbid
const watchList = async(req, res) => {
    let imdbid = sanitize(req.params.id);
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }

    let imdbcode = await createInstance(urlID, true)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let watchDatas = await WatchList.findOne({user_id: userID})
        if (!watchDatas) {
            let addList = new WatchList({
                user_id: userID,
                movies: [imdbcode]
            });
            addList.save((err) => {
                if(err) {
                    console.log(err);
                    return res.status(403).json({})
                }
            })
        } else {
            if (!watchDatas.movies.includes(imdbcode))
                watchDatas.movies.push(imdbcode)
            else
                watchDatas.movies = watchDatas.movies.filter(movies => movies != imdbcode);
                watchDatas.save((err) => {
                    if (err){
                        console.log(err);
                        return res.status(403).json({})
                    }
                })
        }
        return res.status(200).json({})
    } catch (err) { res.status(403).json({}) }
}

// Valeur à mettre: id
const getWatchlist = async (req, res) => {
    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }
    
    try {
        let watchDatas = await WatchList.findOne({user_id: userID})
        return res.status(200).json({watchlist: watchDatas && watchDatas.movies ? watchDatas.movies : []});
    } catch (err) { res.status(403).json({}) }
}

const getHistory = async (req, res) => {
    let userID = res.locals.id;
    if (!userID) { return res.status(404).json({}) }

    try {
        let userDatas = await User.findById(userID)
        if (!userDatas) { throw new Error ('No user found with this id: ', userID); }
        return res.json(userDatas.history)
    } catch (err) { res.status(403).json({}) }
}

const Actions = (req, res) => {
    if (req.params.action === 'like') {
        return likeInteraction(req, res)
    } else if (req.params.action === 'watchlist') {
        return watchList(req, res)
    }
    return res.status(400).json({})
};

module.exports = { Actions, getWatchlist, getHistory, addComment, getInfos, deleteComment, getUserProfile, getUserProfilePublic, updateInfos };