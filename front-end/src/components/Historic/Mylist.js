import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import MoviesCardsGenerator from '../MoviesCardsGenerator/MoviesCardsGenerator';
import Cookies from "universal-cookie";
import {Backdrop, CircularProgress, Container, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import API from './../../utils/API';

const useStyles = makeStyles(theme => ({
    paper: {
        width: '190px !important',
        height: '280px !important',
        margin: theme.spacing(1)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    rootScroll: {
        position: 'fixed',
        zIndex: '300',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        '& .MuiFab-secondary':{
            background: 'rgba(83, 26, 62, 1)'
        }
    },
    containerGridTopMovie: {
        marginTop: '75px'
    },
    title: {
        marginBottom: '0',
        textAlign: 'left',
        color: 'white',
        fontSize: '2.2em',
        fontWeight: '100',
        fontFamily: 'Open-Sans, sans-serif',
        textShadow: '6px 12px 22px #bd20857a'
    },
    titleContainer: {
        padding: '8px',

    },
    topBackground: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '250px',
        width: '100%',
        zIndex: -1,
        background: 'linear-gradient(-180deg, #0d1c37 20%, rgba(0, 0, 0, 0) ) !important'
    },
    dividerTitle: {
        background: 'linear-gradient(-90deg, #3f51b5, rgba(255,255,255,0))',
        marginBottom : '1.5em',
        paddingTop: '1.5px',
        borderRadius: '10px',
        opacity: '0.25',
        boxShadow: '6px 12px 22px #bd20857a'
    }
}));

const translate = {
    fr : {
        Watchlist: 'Ma liste',
        Recent: 'Films vus récemment',
        Nothing: 'Aucun film'
    },
    us : {
        Watchlist: 'Watchlist',
        Recent: 'Recently watched',
        Nothing: 'Nothing to show'
    }
}


const Mylist = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [watchlist, setWatchlist] = useState([]);
    const [recentWatch, setRecentWatch] = useState([]);
    const mvgRef = React.useRef();
    const cookies = new Cookies();
    const [language, setLanguage] = React.useState(() => {
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });
    const [mounted, setMounted] = React.useState(false)

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
            mvgRef.current && mvgRef.current.setLanguageHandle(language);
        },
        setWatchlists(watchlist) {
            setWatchlist(watchlist);
        }
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


    const updateWatchlist = (watchlist) => {
        setWatchlist(watchlist);

    };
        return (
            <Container component="main" className={classes.containerGridTopMovie}>
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={!mounted ? true : false} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className={classes.topBackground} />
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language.language].Watchlist}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {watchlist.length ?
                        <MoviesCardsGenerator
                            ref={mvgRef}
                            updateWatchlist={updateWatchlist}
                            watchlist={watchlist}
                            Mylist={true}
                            moviesList={watchlist}
                            pushHistory={(link) => props.history.push(link)}
                        />
                        :
                    <span  style={{paddingLeft: '8px', color: 'grey', fontSize: '0.8em'}}>{translate[language.language].Nothing}</span>
                }
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language.language].Recent}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {recentWatch.length ?
                    <MoviesCardsGenerator
                        ref={mvgRef}
                        updateWatchlist={updateWatchlist}
                        watchlist={watchlist}
                        Mylist={true}
                        moviesList={recentWatch}
                        pushHistory={(link) => props.history.push(link)}
                    />
                    :
                    <span  style={{paddingLeft: '8px', color: 'grey',fontSize: '0.8em'}}>{translate[language.language].Nothing}</span>
                }
            </Container>
    )
}));

export default Mylist;