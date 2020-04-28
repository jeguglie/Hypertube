import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    movieCover: {
        display: 'block',
        width: '100%',
        height: '100%',
    },
    movieCoverFocus: {
        display: 'block',
        height: '100%',
        opacity: '0.5',
        transition: 'all 0.2s ease-in-out',
        webkitFilter: 'blur(15px)',
        filter: 'blur(15px)'
    },
    movieFocusOverlay:{
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        height: '100%',
        width: '100%',
        opacity: '0',
        transition: 'all 2s',
        background: 'transparent'
    },
    movieCoverContainer: {
        boxShadow: '1px 1px 6px rgba(0,0,0,0.3)',
        borderRadius: '10px',
        width: '190px !important',
        height: '280px !important',
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        transition: 'all 0.2s ease-out;',
        margin: '0',
        '&:hover':{
            transform: 'scale(1.05)',
        },
        '&:hover $movieFocusOverlay':{
            opacity: '1',
            background: 'transparent',
            transition: 'all 2s ',
        }
    },
    growContainer: {
        background: 'transparent !important'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    movieTitleContainer: {
        overflow: 'scroll',
        height: '50px',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    movieTitle: {
        paddingRight: '0.9em',
        paddingLeft: '0.9em',
        color: 'white',
        margin: '0',
        verticalAlign: 'middle',
        textShadow: '1px 1px 5px rgba(0,0,0,0.7)'
    },
    movieRating: {
        textAlign: 'center !important',
        marginTop: '0em',
        '& svg':{
            'filter': 'drop-shadow(2px 2px 1px rgba(50, 50, 0, 0.12))'
        }
    },
    movieRatingStars: {
        '.star': {
            fill: 'red !important',
        },
    },
    releaseDate: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '7px',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)'
    },
    topDateStarsAddContainer: {
        marginTop: '5px'
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
    movieOverview: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.2em',
        paddingLeft: '1.2em',
        lineHeight: '1.2em',
        margin: '0',
        letterSpacing: '0px',
        fontFamily: 'Open-Sans, sans-serif',
        animation: 'textdefilant 15s linear infinite',
        animationDelay: '2s',
    },
    movieOverviewNoScroll: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.2em',
        paddingLeft: '1.2em',
        lineHeight: '1.2em',
        margin: '0',
        letterSpacing: '0px',
    },
    movieOverviewContainer: {
        overflow: 'scroll',
        height: '90px',
        marginTop: '0.5em',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    buttonWatch: {
        position: 'fixed',
        bottom: '0',
        color: 'white',
        right: '0',
        opacity: '0.5',
        fontSize: '2.9em',
        marginRight: '7px',
        marginBottom: '7px',
        borderRadius: '10px',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)',
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.05)'
        },
    },
    moviesGenres: {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '7px',
        margin: '1px',
        borderRadius: '10px',
        fontSize: '0.7em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)'
    },
    moviesGenreContainer: {
        marginTop: '1em',
        marginBottom: '1em',
        paddingRight: '7px',
        paddingLeft: '7px'
    }
}));
export default useStyles;