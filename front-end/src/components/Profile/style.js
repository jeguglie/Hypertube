import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
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
        height: '500px',
        width: '100%',
        zIndex: -1,
        background: 'linear-gradient(-180deg, #0d1c37 40%, rgba(0, 0, 0, 0) ) !important'
    },
    dividerTitle: {
        background: 'linear-gradient(-90deg, #3f51b5, rgba(255,255,255,0))',
        marginBottom : '1.5em',
        paddingTop: '1.5px',
        borderRadius: '10px',
        opacity: '0.25',
        boxShadow: '6px 12px 22px #bd20857a'
    },
    large: {
        width: theme.spacing(26),
        height: theme.spacing(26),
        boxShadow: '3px 3px 1px #202e428c !important',
    },
    textfield: {
        width: '100% !important',
        '& > .MuiFilledInput-root': {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            backgroundColor: '#202e428c !important;',
            color: '#c5c5c5'
        },
        '&input:placeholder': {
            color: 'white !important'
        },
        '& .MuiFormHelperText-contained':{
            color: 'red'
        },
        '& .MuiInputLabel-filled':{
            color: 'white !important'
        },
        '& .MuiFilledInput-underline:after': {
            borderColor: '#18468a !important',
            borderRadius: '10px'
        },
        '& .MuiFilledInput': {
            overflow:'hidden'
        },
        '& .MuiFilledInput-underline:before': {
            borderColor: '1px solid rgb(0, 0, 0) !important',
        },
        '& .MuiFilledInput-underline': {
            borderColor: '1px solid white !important'
        },
        '& .MuiFilledInput-input': {
            padding: '35px 15px 15px !important'
        }
    },
    textfieldbetween: {
        ' & >.MuiFilledInput-root': {
            borderTopRightRadius: '0px !important',
            borderTopLeftRadius: '0px !important',
        }
    },
    textfieldbottom: {
        ' & >.MuiFilledInput-root': {
            borderTopRightRadius: '0px !important',
            borderTopLeftRadius: '0px !important',
            borderBottomRightRadius: '10px !important',
            borderBottomLeftRadius: '10px !important',

        }
    },
    saveChanges: {
        background: '#18468a',
        color: 'white',
        textAlign: 'center',
        borderRadius: '10px !important',
        marginTop: '1.5em',
        '&:hover': {
            background: '#174282',
        }
    },
    addPicture: {
        background: '#202e42 !important',
        color: 'white',
        textAlign: 'center',
        borderRadius: '10px !important',
        marginTop: '1.5em',
        fontSize: '0.8em',
        '&:hover': {
            background: '#202e42 !important',
        }
    },
    containerInfos: {
        width: '100% !important',
        [theme.breakpoints.down('xs')]: {
            marginTop: '1.6em'
        },
    },
    commentProgress: {
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    FormControlLabel: {
        ' & >.MuiTypography-root': {
            fontSize: '0.875rem !important',
            fontWeight: '500 !important'
        },
        '& > .MuiCheckbox-colorPrimary.Mui-checked': {
            color: 'white'
        },
        '.MuiSvgIcon-root': {
            color: 'white !important'
        }
    },
    fileUploadInput: {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '100%',
        margin: '0',
        padding: '0',
        outline: 'none',
        opacity: '0',
        cursor: 'pointer'
    },
    imageUploadWrap: {
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '10px'
    },
    containerBottomButtons: {
        textAlign: 'center'
    },
    spanDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: '5px'
    },
    labelSpan: {
        color: 'white',
        fontSize: '0.7em',
    },
    labelTitle: {
        marginBottom: '0',
        textAlign: 'left',
        color: 'white',
        fontSize: '2.2em',
        fontWeight: '100',
        fontFamily: 'Open-Sans, sans-serif',
        textShadow: '6px 12px 22px #bd20857a'
    }
}));

export default useStyles;