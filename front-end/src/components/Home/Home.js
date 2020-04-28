import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SidebarHome from '../../components/SidebarHome/SidebarHome'
import MoviesCardsGenerator from '../../components/MoviesCardsGenerator/MoviesCardsGenerator'
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios'
import {
    Container,
    CircularProgress,
    Backdrop,
    Fab,
    Zoom, Divider
} from '@material-ui/core'
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Cookies from "universal-cookie";

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
        marginTop: '75px',
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

const key = 'f29f2233f1aa782b0f0dc8d6d9493c64';
const query = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${key}&page=`;

// Hook

const Home = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [moviesList, setMoviesList] = useState(false);
    const [sidebarQuery, setSidebarQuery] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [searchValue, setSearchValue] = useState(false);
    const [loadPage, setLoadPage] = useState(1);
    const [load, setLoad] = useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const sidebarRef = React.useRef();
    const [open, setOpen] = React.useState(false);
    const handleDrawerClose = () => setOpen(false);
    const cookies = new Cookies();
    const [trigger, setTrigger] = React.useState(false);
    const [language, setLanguage] = React.useState(() => {
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
            language: newLang,
            languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });
    // Get the previous value (was passed into hook on last render)
    const translate = {
        fr: {
            TopMovies: 'Top Films',
            searchTitle: 'Recherche pour ',
            stopLoading: 'Désactiver scroll infini',
            enableLoading: 'Activer scroll infini'
        },
        us: {
            TopMovies: 'Top Movies',
            searchTitle: 'Search for ',
            stopLoading: 'Stop infinite scroll',
            enableLoading: 'Enable infinite scroll'

        }
    };

    useEffect(() => {
        props.injectWatchlist();
    }, [props])

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setSidebar(bool){ setOpen(bool) },
        setSearch(query, searchValue){
            setSidebarQuery(query);
            setSearchValue(searchValue);
        },
        setLanguageHandle(newLang) {
            if (newLang.language !== language.language){
                setMoviesList(false);
                setLanguage(newLang);
                sidebarRef.current && sidebarRef.current.setLanguageHandle(newLang);
            }
        },
        setWatchlists(watchlist) {
            setWatchlist(watchlist);
        }
    }));


        const handleClick = event => {
            const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
            anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

    useEffect(() => {
        async function loadMore() {
            let selectQuery = sidebarQuery ? sidebarQuery : query;
            await axios.get(`${selectQuery}${loadPage}&${language.languageRequest}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        setMoviesList([].concat(moviesList, res.data.results));
                });
        }
        if (load) {
            if (loadPage > 1)
                setTrigger(true);
            loadMore();
            setLoad(false);
        }
    }, [load, moviesList, loadPage, sidebarQuery, language]);

    // First load (top movies)
        useEffect(() => {
            let isCancelled = false;
            const getmoviesList = async() => {
                await axios.get(`${query}${1}&${language.languageRequest}`)
                    .then(res => {
                        for (let i = 0; i < res.data.results.length; i++) {
                            if (res.data.results[i].vote_count === 0) { res.data.results.splice(i, 1); }
                        }
                        if (res.data && res.data.results && res.data.results.length)
                            !isCancelled && setMoviesList(res.data.results);
                    })
            }
            if (!moviesList) {
                !isCancelled && getmoviesList(language.languageRequest);
            }
            return () => { isCancelled = true; }
        }, [moviesList, language]);


    // Receive query from SidebarHome
    const handlePushQuery = (query) => {
        if (query && query.length){
            setSidebarQuery(query);
        }
    };

    useEffect(() => {
        let isCancelled = false;
        function getMoviesList() {
            axios.get(`${sidebarQuery}${loadPage}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        !isCancelled && setMoviesList(res.data.results)
                    else
                        !isCancelled && setMoviesList([])
                })
        };
        if (sidebarQuery)
            getMoviesList();
        return () => { isCancelled = true }
    }, [sidebarQuery, loadPage]);

    const updateWatchlist = (watchlist) => {
       setWatchlist(watchlist);
       props.setWatchlist(watchlist);
    }


    const handleSetLoadMovies = () => {
        if (moviesList && moviesList.length) {
            setLoadPage(loadPage + 1);
            setLoad(true);
        }
    };


    return (
        <Container component="main" className={classes.containerGridTopMovie} maxWidth={'xl'}>
            <div className={classes.topBackground} />
            {/* Loader -> when page load */}
            <Backdrop className={classes.backdrop} open={!moviesList ? true : false} >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Sidebar -> App.js send props here, then home send props to sidebar */}
            <SidebarHome
                sidebarClose={handleDrawerClose}
                sidebarActive={open}
                ref={sidebarRef}
                pushQuery={handlePushQuery}
             />
            {moviesList.length ? <React.Fragment>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{ searchValue ? `${translate[language.language].searchTitle} ${searchValue}` : `${translate[language.language].TopMovies}` }</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <InfiniteScroll next={handleSetLoadMovies} hasMore={hasMore} dataLength={moviesList ? moviesList.length : 0} ></InfiniteScroll>
                {/* Movies card map */}
                <MoviesCardsGenerator
                    updateWatchlist={updateWatchlist}
                    watchlist={watchlist}
                    Mylist={false}
                    moviesList={moviesList}
                    pushHistory={(link) => props.history.push(link)}
                />

                <Zoom in={trigger} >
                    <div role="presentation" className={classes.rootScroll} style={{display: 'flex', flexDirection: 'column'}}>
                        <Fab onClick={handleClick} color="secondary" size="small" aria-label="scroll back to top">
                            <KeyboardArrowUpIcon />
                        </Fab>

                        <Tooltip title={
                                hasMore ? `${translate[language.language].stopLoading}` :
                                `${translate[language.language].enableLoading}`}
                                 placement={'left'}
		    		arrow
                        >
                        <Fab onClick={()=> setHasMore(!hasMore)} style={{marginTop: '7px'}}color="secondary" size="small" aria-label="scroll back to top">
                            {hasMore ? <PauseRoundedIcon /> : <AllInclusiveIcon />}
                            </Fab>
                        </Tooltip>
                    </div>
                </Zoom>
            </React.Fragment>: null}
        </Container>

    )
}));

export default Home;
