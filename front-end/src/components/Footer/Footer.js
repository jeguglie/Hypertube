import React from 'react';
import HypertubeIso from '../../assets/img/hypertube-logo-footer.svg';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Link} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    footer: {
        fixed: 'bottom',
        marginTop: '145px',
        flexShrink: '0',
        paddingTop: '10px',
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    logoFooter: {
        width: '150px',
    },
    containerImg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleFooter: {
        margin: '1.6em',
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        fontWeight: '100',
        fontFamily: 'Open-Sans, sans-serif',
    },
    gridImg: {
        margin: '1em',
    },
    gridAuthors: {
        margin: '1em',
        [theme.breakpoints.down('xs')]: {
            margin: '0em',
            marginBottom: '1.5em',
        },
    },
    category: {
        color: 'black',
        marginRight: '10px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '10px',
        textShadow: '6px 12px 22px #bd20857a',
        padding: '6px',
    }
}));

const Footer = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.footer}>
            <Grid container justify={'center'} alignItems={'center'} alignContent={'center'} direction={"row"}>
                <Grid item size={'xs'} className={classes.gridImg}>
                    <div className={classes.containerImg}>
                        <img
                            src={process.env.REACT_APP_CUSTOM_NODE_ENV === 'localhost' ?
				HypertubeIso : 
				    '/assets/img/hypertube-logo-footer.svg'
			    }
                            alt={"Hypertube Iso Logo"}
                            className={classes.logoFooter}
                        />
                    </div>
                </Grid>
                <Grid item size={'xs'} className={classes.gridAuthors}>
                    <p className={classes.titleFooter}>
                        <span className={classes.category}>Front-end</span>{" "}
                        <Link style={{ color: 'white'}} target="_blank" href={"https://www.github.com/jeguglie"}>
                            <span className={classes.author}>jeguglie</span>
                        </Link>
                    </p>
                    <p className={classes.titleFooter}>
                        <span className={classes.category}>Back-end</span>{" "}
                        <span className={classes.author}>
                            <Link style={{ color: 'white'}} target="_blank" href={"https://www.github.com/dilaouid"}>
                                dilaouid
                            </Link>
                        </span>
                        <span className={classes.author}>
                            <Link style={{ color: 'white'}} target="_blank" href={"https://www.github.com/bajouini"}>
                                {`  |  bajouini`}
                            </Link>
                        </span>
                        <span className={classes.author}>
                             <Link style={{ color: 'white'}} target="_blank" href={"https://www.github.com/jeguglie"}>
                                 {`  |  jeguglie`}
                             </Link>
                        </span>
                    </p>
                </Grid>
            </Grid>
        </div>
    )
};
export default Footer;
