import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
    Container,
    Divider,
    Grid,
    Avatar,
    Backdrop,
    CircularProgress,
} from "@material-ui/core";
import API from "../../utils/API";
import Cookies from "universal-cookie";
import MoviesCardsGenerator from "../MoviesCardsGenerator/MoviesCardsGenerator";
import useStyles from './style.js';
const defaultSrc = "https://i.ibb.co/hgvJPFb/default-Img-Profile.png";

const ProfilePublic = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [defaultImg, setDefaultImg] = useState(defaultSrc);
    const [watchlist, setWatchlist] = useState([]);
    const [recentWatch, setRecentWatch] = useState([]);
    const [language, setLanguage] = React.useState(() => {
        const cookies = new Cookies();
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });

    const translate = {
        fr: {
            firstname: 'Prénom',
            lastname: 'Nom',
            username: "Nom d'utilisateur",
            Watchlist: 'Watchlist',
            Recent: 'Films vus récemment',
            Nothing: 'Aucun film'
        },
        us: {
            firstname: 'First name',
            lastname: 'Last name',
            username: 'Username',
            Watchlist: 'Watchlist',
            Recent: 'Recently seen',
            Nothing: 'Nothing to show',
        }
    };

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) { setLanguage(language) },
        setWatchlists(watchlist) { setWatchlist(watchlist) }
    }));

    useEffect(() => {
        let RecentTab = [];
        let mounted = true;
        const getMylist = async() => {
            await API.getHistory()
                .then(res => {
                    if (res.data && res.data.length){
                        RecentTab = res.data.map((obj) => {
                            return obj.imdbcode;
                        });
                    }
                    mounted && setRecentWatch(RecentTab);
                });
            mounted && setMounted(true);

        }
        getMylist();
        return () => {mounted = false}
    }, [])


    useEffect(() => {
        props.injectWatchlist();
    }, [props])

    const updateWatchlist = (watchlist) => { setWatchlist(watchlist) }

    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({
        firstname: '',
        lastname: '',
        username: '',
    });


    useEffect(() => {
        async function getUserProfilePublic(username) {
            await API.getUserProfilePublic(username)
                .then(res => {
                    if (res.status === 200 && res.data) {
                        setTextFieldsValues({
                            firstname: res.data.firstname,
                            lastname: res.data.lastname,
                            username: res.data.username,
                        });
                        setDefaultImg(res.data.img);
                        setMounted(true);
                    }
                })
        }

        if (!mounted && props.match.params.username) {
            getUserProfilePublic(props.match.params.username)
        }
    }, [props, mounted]);


    return (
        <Container component="main" maxWidth={"lg"} className={classes.containerGridTopMovie}>
            <form noValidate>
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={!mounted}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{fieldValue.username}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <div className={classes.profileContainer}>
                    <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row"
                          justify="space-evenly" alignItems="center">
                        <Grid item sm={6}>
                            <Grid container direction={"column"} alignItems="center" alignContent={'center'}>
                                <Grid item>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={defaultImg}
                                        className={classes.large}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={6}>
                            <Grid className={classes.containerInfos} container direction={"column"} alignItems="stretch"
                                  alignContent={'center'}>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <div className={classes.spanDiv}>
                                        <span className={classes.labelSpan}>{translate[language.language].firstname}</span>
                                        <span className={classes.labelTitle} style={{fontSize: '1.5em'}}>{fieldValue.firstname || ''}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <div className={classes.spanDiv}>
                                        <span className={classes.labelSpan}>{translate[language.language].lastname}</span>
                                        <span className={classes.labelTitle}style={{fontSize: '1.5em'}}>{fieldValue.lastname || ''}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <div className={classes.spanDiv}>
                                        <span className={classes.labelSpan}>{translate[language.language].username}</span>
                                        <span className={classes.labelTitle}style={{fontSize: '1.5em'}}>{fieldValue.username || ''}</span>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language.language].Watchlist}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {watchlist.length ?
                    <MoviesCardsGenerator
                        updateWatchlist={updateWatchlist}
                        watchlist={watchlist}
                        Mylist={true}
                        moviesList={watchlist}
                        pushHistory={(link) => props.history.push(link)}
                    />
                    :
                    <span style={{
                        paddingLeft: '8px',
                        color: 'grey',
                        fontSize: '0.8em'
                    }}>{translate[language.language].Nothing}</span>
                }
                    <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language.language].Recent}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {recentWatch.length ?
                    <MoviesCardsGenerator
                        updateWatchlist={updateWatchlist}
                        watchlist={watchlist}
                        Mylist={true}
                        moviesList={recentWatch}
                        pushHistory={(link) => props.history.push(link)}
                    />
                    :
                    <span style={{
                        paddingLeft: '8px',
                        color: 'grey',
                        fontSize: '0.8em'
                    }}>{translate[language.language].Nothing}</span>
                }
                    </form>
        </Container>
    )
}));

export default ProfilePublic;