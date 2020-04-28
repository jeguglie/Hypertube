import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
    Container,
    Badge,
    Popover,
    Divider,
    Typography,
    Grid,
    Grow,
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    Fade,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Backdrop
} from '@material-ui/core';
import StarRatings from 'react-star-ratings';
import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
import axios from 'axios';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CircularProgress from '@material-ui/core/CircularProgress';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ReactPlayer from "react-player";
import API from './../../utils/API';
import CommentIcon from '@material-ui/icons/Sms';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import Cookies from "universal-cookie";
import 'moment/locale/fr';
import VisibilityIcon from '@material-ui/icons/Visibility';
import useStyles from './style';
import AddMovie from "../../components/MoviesCardsGenerator/AddMovie";
import {store} from "react-notifications-component";
const moment = require('moment');
const Aux = (props) => props.children;
const io = require('socket.io-client');
const socket_port = process.env.REACT_APP_SOCKET_PORT;
const server_port = process.env.REACT_APP_SERVER_PORT;
const burl = process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? `http://localhost:${server_port}/api` : 'https://hypertube.jv-g.fr/api';
const socket = process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? io(`http://localhost:${socket_port}`) : io('https://hypertube.jv-g.fr');

const translate = {
    fr: {
        commentInfos: 'Entre 8 et 130 caractères',
        chooseSrc: 'Choisir une source',
        noSrc: 'Aucune source disponible',
        noComments: 'Aucun commentaire',
        pressEnter: 'Entrée pour envoyer',
        messageRemoved: "Le film a bien été retiré de votre liste",
        messageAdd: "Le film a bien été ajouté à votre liste",
        views: 'vues'
    },
    us: {
        messageRemoved: "Movie was successfully removed from watch list",
        messageAdd: "Movie was successfully added from watch list",
        chooseSrc: 'Choose a source',
        noSrc: 'No source available',
        noComments: 'No comments',
        pressEnter: 'Press enter to send',
        commentInfos: 'Between 8 and 130 characters',
        views: 'views'
    }
}

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, movieSources, movieID, language } = props;

    const handleClose = () => {
        onClose(selectedValue, movieID)
    };

    const handleListItemClick = value => {
        onClose(value, movieID);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{translate[language.language].chooseSrc}</DialogTitle>
            <List>
                {movieSources && movieSources.ytsInfo && Array.isArray(movieSources.ytsInfo) && movieSources.ytsInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('yts-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
                {movieSources && movieSources.leetInfo && Array.isArray(movieSources.leetInfo) && movieSources.leetInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('1377-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}


const MovieCard = (forwardRef((props, ref) => {
    let classes = useStyles();
    const [movieDetails, setMovieDetails] = useState(null);
    const [movieSources, setMovieSources] = useState(null);
    const [loadingSources, setLoadingSources] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [movieSrc, setMovieSrc] = useState(null);
    const [subtitles, setSubtitles] = useState([]);
    const cookies = new Cookies();
    const [language, setLanguage] = React.useState(() => {
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });
    const [openTool, setOpenTool] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [getComments, setComments] = React.useState([]);
    const [commentValue, setCommentValue] = React.useState([]);
    const [userID, setUserID] = React.useState(false);
    const [loadingComment, setLoadingComment] = React.useState(true);
    const [views, setViews] = React.useState('');
    const [watchlist, setWatchlist] = useState([]);
    const [myAvatar, setMyAvatar] = useState(false);
    const [poster, setPoster] = useState(false);

    const handleClickAddWatchlist = async (id, action) => {
        let j = 0;
        API.likeWatchlist(id)
            .catch((err) => console.log(err));
        if (action === 'remove') {
            store.addNotification({
                message: translate[language.language].messageRemoved,
                insert: "top", type: 'success',
                container: "bottom-left",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {duration: 3000, onScreen: true}
            });
            watchlist.map((obj, i) => {
                if (obj === id) j = i;
                return true
            });
            watchlist.splice(j, 1);
            setWatchlist(watchlist);
            // props.updateWatchlist(watchlist);
        } else if (action === 'add') {
            store.addNotification({
                message: translate[language.language].messageAdd,
                type: 'success', insert: "top",
                container: "bottom-left",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {duration: 3000, onScreen: true}
            });
            // let entry = await createWatchlistEntry(id);
            watchlist.push(id);
            setWatchlist(watchlist);
            // props.updateWatchlist(watchlist);
        }
    };

    useEffect(() => {
        props.injectWatchlist();
    }, [props])

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        },
        setWatchlists(watchlist) {
            setWatchlist(watchlist);
        }
    }))

    const handleKeyDownComment = async(e) => {
        if (e.keyCode === 13 && commentValue) {
            setLoadingComment(true);
            await API.addComment(props.match.params.movieId, commentValue)
                .then(res => {
                    if (res.status === 200 && res.data.newComment){
                        getComments.push(res.data.newComment);
                        setComments(getComments)
                        setMyAvatar(res.data.newComment.img)
                    }

                })
                .catch(err => setOpenTool(true))
            setCommentValue('');
        }
        setLoadingComment(false);
    };
    const handleDeleteComment = async(commentID, key) => {
        setLoadingComment(true);
        await API.deleteComment(props.match.params.movieId, commentID)
            .then(res => {
                if (res.status === 200)
                    getComments.splice(key, 1)
                    setComments(getComments);

            })
            .catch(err => setOpenTool(true))
        setLoadingComment(false);
    };

    // On mount (when props are received or when the page with /movie/:id is loaded
    useEffect(() => {
        let _mounted = true;
        const handleGetComments = async(movieID) => {
            await API.getComments(movieID)
                .then(res => {
                    if (res.status === 200 && res.data.commentsList) {
                        let comments = res.data.commentsList;
                        comments.avatar = res.data.avatar;
                        _mounted && setComments(comments);
                        _mounted && setViews(res.data.views);
                        if (res.data.userID)
                        _mounted && setUserID(res.data.userID);
                    }
                });
            _mounted && setLoadingComment(false);
        };
        const constructSubtitles = (subtitles) => {
            if (subtitles){
                let subTab = Object.entries(subtitles);
                let subObject = [];
                if (subTab && subTab.length)
                    for (let i = 0; i < subTab.length; i++){
                        let src = subTab[i][1].split('/');
                        src = src[src.length - 2].concat("/" + src[src.length -1]);
                        subObject.push(Object.assign({
                            kind: 'subtitles',
                            src: `${burl}/subtitles/${src}`,
                            srcLang: subTab[i][0],
                        }))
                    }
                return subObject;
            }
        };
        function setMovieDetail() {
            const cookies = new Cookies();
            let lang = cookies.get('lg');
            let data = null;
            const lg = lang === 'us' ? 'language=en-US' : 'language=fr-FR';
            axios.get(`https://api.themoviedb.org/3/movie/${props.match.params.movieId}?api_key=c91b62254304ec5dbb322351b0dc1094&${lg}`)
                .then(res => {
                    if (res.data && res.data.imdb_id) {
                        data = res.data;
                        _mounted && setMovieDetails(data)
                    }
                }).catch(err => {
                    if (err.response && err.response.status !== 200) {
                       _mounted && props.history.push('/');

                    }
                });

        }
        // Get infos about movie (if available on yts, 1337...)
        function getMovieSources() {
            API.getMovieSources(props.match.params.movieId)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data && (res.data.inYTS || res.data.inLeet )) {
                            _mounted && setSubtitles(constructSubtitles(res.data.subtitles));
                            _mounted && setMovieSources(res.data);
                        }
                        else
                            _mounted && setMovieSources(null);
                    }
                    else
                        _mounted && setMovieSources(null);
                    _mounted && setLoadingSources(false);
                })

        }
        // Get movie infos (vote, title, overview, poster...)
        if (_mounted && props.match.params.movieId) {
            let isnum = /^\d+$/.test(props.match.params.movieId);
            if (isnum) {
                _mounted && setMovieDetail();
                _mounted && getMovieSources();
                _mounted && handleGetComments(props.match.params.movieId);
            }
            else
                _mounted && !isnum && props.history.push('/');
        }
        return () => {
            _mounted = false
        }
    }, [props, language])

    useEffect(() => {
        let _mounted = true;

        if (!poster && movieDetails)
            if(movieDetails.poster_path)
                _mounted && setPoster(`https://image.tmdb.org/t/p/w185${movieDetails.poster_path}`);
            else
                _mounted && setPoster('https://i.ibb.co/hgvJPFb/default-Img-Profile.png');
        return () => {
            _mounted = false
        }
    }, [movieDetails, poster])

    // Movie source selection
    const handleClickOpen = () => { setOpen(true) };
    const handleClose = (value, movieID) => {
        setOpen(false);
        setMovieSrc(false);
        setLoadingComment(true);
        socket.emit("stream:unmount");
        setTimeout(() => {
            setTimeout(() => {
                socket.emit("stream:play", movieID)
            }, 3000);
            setSelectedValue(value);
        }, 3000)
        setLoadingComment(false);
    };

    useEffect(() => {
        let mounted = true;
        function streamMovie() {
            let src = null;
            let splittedValues = selectedValue.split('-');
            if (splittedValues.length > 1)
                src = `${burl}/movies/${splittedValues[0]}/${splittedValues[1]}/${movieDetails.imdb_id}`
            mounted && setMovieSrc(src);
        }
        if (selectedValue) {
            mounted && streamMovie();
        }
        return () => {
            socket.emit("stream:unmount");
            mounted = false
        }
    }, [selectedValue, movieDetails]);

    // Movies genres generator
    const genMovieGenres = (obj) => {
        if(obj.genres && obj.genres.length)
            return obj.genres.map((genre, key) => {
                return (
                    <Grid key={key} className={classes.moviesGenres} item>
                        <span >{genre.name}</span>
                    </Grid>);
            });
        return null;
    };

    const sourceMessage = () => {
        if (movieSources) return selectedValue ? selectedValue : `${translate[language.language].chooseSrc} (${movieSources.ytsInfo.length + movieSources.leetInfo.length})`;
        else return translate[language.language].noSrc
    };

    const handleCloseTool = () => {
        setOpenTool(false)
    };
    const handleOpenTool = () => { setOpenTool(true) };


    const handleClickComment = event => { setAnchorEl(event.currentTarget) };
    const handleCloseComment = () => { setAnchorEl(null) };

    const comments = () => {
        if (getComments && getComments.length){
            return getComments.map((obj, key) => {
                return (
                    <Aux key={key}>
                        <ListItem alignItems="flex-start" style={{paddingBottom: '0'}}>
                            <ListItemAvatar style={{cursor: 'pointer'}} onClick={(e) => { e.preventDefault(); props.history.push(`/user/${obj.user}`)} }>
                                {userID === obj.userID ? <Avatar alt="avatar" src={myAvatar ? myAvatar : obj.avatar} /> : <Avatar alt="avatar" src={obj.avatar} />}
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.listCommentUsername}
                                        >
                                            {obj.user}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <span  className={classes.listCommentText}>
                                            {obj.comment}
                                        </span>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <div className={classes.bottomCommentInfos}>
                                <span className={classes.bottomItemDate}>
                                    {moment(new Date(obj.date * 1000)).fromNow()}
                                </span>
                                {userID === obj.userID ?
                                    <span className={classes.bottomItemDelete}>
                                        <DeleteIcon  onClick={ () => handleDeleteComment(obj.id, key)}/>
                                    </span> : null }
                        </div>
                        {key < getComments.length - 1 ?
                            <Divider style={{backgroundColor: '#f7c12d', opacity: '0.5'}} variant="inset" component="li" />
                            : null}
                    </Aux>
                )
            })
        }
        else
            return (
                <div className={classes.commentContainer}>
                    <p style={{ color : 'white', paddingLeft: '10px', opacity: '0.7', fontSize: '0.8em'}}>{translate[language.language].noComments} </p>
                </div>
            )
    };

    const genProd = (production_companies) => {
        return production_companies.map((obj, i) => {
            return (
                <span key={i} className={classes.prodCompanies}>{obj.name}</span>
            )
        })
    }

    if (movieDetails) {
        const openComment = Boolean(anchorEl);
        const id = openComment ? 'simple-popover' : undefined;
        return (
            <Container>
                <Backdrop className={classes.backdrop} open={!movieDetails ? true : false} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Container
                    maxWidth={'md'}
                    className={classes.containerMovieDetails}
                >
                    <Grid style={{marginBottom: '1.5em'}} container justify={'space-between'}
                          alignItems={'flex-start'} alignContent={'center'}>
                        <Grid item xs={'auto'} className={classes.movieReturnBack}>
                            <a href={'#  '}>
                                <ArrowBackIosIcon
                                    fontSize="large"
                                    style={{color: 'white'}}
                                    id="arrowBackIosIcon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.history.push('/')
                                    }}
                                />
                            </a>
                        </Grid>
                        <Grid item xs={'auto'}>
                            {/*<AddCircle fontSize="large" id="addCircle"/>*/}
                                <AddMovie handleClickAddWatchlist={handleClickAddWatchlist} movieCard={true} watchlist={watchlist} id={movieDetails.id} />
                        </Grid>
                    </Grid>
                    <Grid style={{marginBottom: '1.5em'}} container
                          alignItems={'flex-end'} justify={"flex-end"} alignContent={'flex-end'}>
                        <Grid item xs={'auto'} className={classes.commentIcon}>
                            <Badge badgeContent={getComments ? getComments.length : ''}  color="primary">
                                <CommentIcon onClick={handleClickComment} aria-describedby={id} fontSize="large" id="commentIcon"/>
                            </Badge>
                            <Popover
                                id={id}
                                open={openComment}
                                anchorEl={anchorEl}
                                onClose={handleCloseComment}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                className={classes.popoverComment}
                            >
                                <List className={classes.listComment}  >
                                    <div className={classes.commentContainer}>
                                        {comments()}
                                        <div className={classes.inputCommentContainer}>
                                            <div className={classes.sendIcon}>
                                                {loadingComment ? <CircularProgress size={24} className={classes.commentProgress} /> : <SendIcon /> }
                                            </div>
                                            <Tooltip open={openTool} onClose={handleCloseTool} onOpen={handleOpenTool} title={translate[language.language].commentInfos}>
                                                <InputBase
                                                    placeholder={translate[language.language].pressEnter}
                                                    classes={{root: classes.inputRoot, input: classes.inputInput }}
                                                    inputProps={{ 'aria-label': 'comment' }}
                                                    value={commentValue}
                                                    onChange={(e) => {
                                                        setCommentValue(e.target.value);
                                                        commentValue.length > 2 ? setOpenTool(false) : setOpenTool(true);
                                                    }}
                                                    onKeyDown={handleKeyDownComment}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </List>
                            </Popover>
                        </Grid>
                    </Grid>
                    {poster ?
                    <div
                        style={{
                            background: `url(${poster ? poster : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'})`,
                            backgroundSize: 'cover',
                            filter: 'blur(150px) brightness(1.8)',
                            boxShadow: 'inset 1px 1px 20px rgba(0,0,0,1)',
                            width: '100%',
                            height: '100%',
                            top: '50px',
                            position: 'absolute',
                            zIndex: '-1',
                            opacity: '0.3'
                        }}
                    /> : null}
                    <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row"
                          justify="center" alignItems="center">
                        <Grid className={classes.containerImg} item xs={'auto'} sm={4}>
                            <Grow in={true}>
                                <img
                                    className={classes.movieCoverContainer}
                                    src={poster ? poster : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                    alt={movieDetails.title}
                                />
                            </Grow>
                        </Grid>
                        <Grid style={{paddingLeft: '1em', paddingRight: '1em'}} item xs={'auto'} sm={8}>
                            <Grid item xs={12} sm={12}>
                                <Grid className={classes.containerDate_Vote} item xs={8}>
                                    <span
                                        className={classes.releaseDate}>{movieDetails.release_date.slice(0, 4)}</span>
                                    <StarRatings rating={movieDetails.vote_average / 2} starRatedColor="#f7c12d"
                                                 starDimension="17px" starSpacing="1.5px"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container style={{marginTop: '1em', marginBottom: '0.5em'}}
                                          direction="row" justify="flex-start" alignItems="flex-start">
                                        {genMovieGenres(movieDetails)}
                                    </Grid>
                                </Grid>
                                {movieDetails.production_companies && movieDetails.production_companies.length ?
                                    <Grid item xs={12}>
                                        <Grid container style={{marginTop: '0.5em', marginBottom: '0.5em'}}
                                              direction="row" justify="flex-start" alignItems="center">
                                            {genProd(movieDetails.production_companies)}
                                        </Grid>
                                    </Grid> : null}
                                <Grid item xs={12}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{marginRight:'10px'}}>
                                            <h1 className={classes.movieTitle}>{movieDetails.title}</h1>
                                        </div>
                                        <div>
                                            <Tooltip title={`${views} ${translate[language.language].views}`} placement="right">
                                                <Badge badgeContent={views ? parseInt(views) : ''}  color="primary">
                                                    <VisibilityIcon style={{color: 'white'}} />
                                                </Badge>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <p className={classes.movieOverview}>
                                        {movieDetails.overview}
                                    </p>
                                </Grid>
                                <Grid style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '1.5em'}} item
                                      xs={12}>
                                    {loadingSources ?
                                        <div className={classes.loadingSources}>
                                            <Fade in={loadingSources} unmountOnExit>
                                                <CircularProgress style={{color: 'white'}}/>
                                            </Fade>
                                        </div> : null}
                                    <br/>
                                    <Button
                                        variant="outlined"
                                        className={classes.buttonChooseSource}
                                        onClick={handleClickOpen}
                                        disabled={!movieSources ? true : false}
                                    >
                                        {sourceMessage()}
                                    </Button>
                                    <SimpleDialog language={language} movieSources={movieSources} selectedValue={selectedValue}
                                                  open={open} onClose={handleClose} movieID={props.match.params.movieId}/>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                {
                    movieSrc ?
                        <Container style={{padding: '0', marginTop: '2.5em', userSelect: 'false'}}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <div   className={classes.playerWrapper}>
                                        <ReactPlayer
                                            width='100%'
                                            height='100%'
                                            url={movieSrc}
                                            className={classes.reactPlayer}
                                            playing
                                            controls={true}
                                            config={{
                                                file: {
                                                    attributes: {
                                                        crossOrigin: 'use-credentials'
                                                    },
                                                    tracks: subtitles
                                                }
                                            }}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Container> : null
                }
            </Container>
        )

    }
    return null
}));
export default MovieCard;
