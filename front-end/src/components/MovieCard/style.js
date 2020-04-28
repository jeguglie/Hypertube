import {fade, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    containerMovieDetails: {
        marginTop: '115px !important',
        position: 'relative'
    },
    movieTitle: {
        color: 'white',
        textAlign: 'left !important',
        marginBottom: '0',
        marginTop: '0',
        fontSize: '1.5em',
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
    movieCoverContainer: {
        width: '190px',
        height: '280px',
        overflow: 'hidden',
        borderRadius: '10px'

    },
    containerImg: {
        textAlign: 'center',
        '& img': {
            boxShadow: '10px 10px 2px rgba(0,0,0,0.05)'
        },
    },
    moviesGenres: {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '9px',
        marginRight: '0.5em',
        marginBottom: '0.5em',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)',
        minWidth: '0.8em',
    },
    movieOverview: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.5em',
        lineHeight: '1.2em',
        marginTop: '1.2em',
        marginBottom: '1.2em',
        letterSpacing: '0px',
        // fontFamily: 'Open-Sans, sans-serif',
    },
    releaseDate: {
        marginRight: '1em',
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
    containerDate_Vote: {
        textAlign: 'left',
        marginTop: '1em'
    },
    commentIcon: {
        color: '#ffffff',
        fontSize: '2em',
        cursor: 'pointer',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.1)'
        }
    },
    movieReturnBack: {
        fontSize: '2em',
        paddingTop: '5px',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.1)'
        }
    },
    playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */
    },
    reactPlayer: {
        position: 'absolute',
        top: '0',
        left: '0'
    },
    buttonChooseSource: {
        color: 'white',
        borderColor: 'white'
    },
    loadingSources: {
        marginRight: '1em',
        color: 'white',
    },
    commentContainer: {
        'MuiPaper-root': {
            borderRadius: '10px',
            background: 'none'
        }
    },
    inline: {
        display: 'inline',
    },
    popoverComment: {
        '& .MuiPopover-paper' : {
            background: 'none !important',
            borderRadius: '10px',
        }
    },
    listComment: {
        width: '100%',
        maxWidth: 360,
        borderRadius: '10px',
        background: 'radial-gradient(rgb(77, 24, 60), rgb(11, 16, 35)) !important',
        color: 'white'
    },
    listCommentUsername: {
        color: 'white',
        fontWeight: 'bold',
    },
    listCommentText: {
        color: 'white',
        maxWidth: '150px',
        wordBreak: 'break-word'
    },
    inputCommentContainer: {
        margin: 0,
        marginTop: '8px',
        marginBottom: '-8px',
        position: 'relative',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    },
    sendIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    bottomCommentInfos: {
        display: 'flex',
        alignContent: 'center',
        color: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    bottomItemDelete: {
        fontSize: '0.7em',
        marginRight: '10px',
        opacity: '0.7',
        '&:hover': {
            color: '#f7c12d',
            opacity: '1'
        }
    },
    bottomItemDate: {
        fontSize: '0.7em',
        marginRight: '10px',
        fontStyle: 'italic',
        opacity: '0.7'
    },
    commentProgress: {
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    prodCompanies: {
        color: 'white',
        opacity: '1',
        borderRadius: '10px',
        fontSize: '0.5em',
        marginRight: '0.5em',
        marginBottom: '0.5em',
        padding: '5px',
        verticalAlign: 'center',
        textAlign: 'center',
        paddingBottom: '6px',
        border: '0.5px solid rgba(255,255,255,0.3)',
        '&:hover': {
            color: 'black',
            backgroundColor: 'white'
        }
    }
}));

export default useStyles;