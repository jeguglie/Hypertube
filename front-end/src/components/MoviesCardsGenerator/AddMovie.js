import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    addIcon: {
        color: '#f7c12d !important',
        paddingTop: '5px',
        textAlign: 'center !important',
        transform: 'scale(1)',
        verticalAlign: 'middle' ,
        cursor: 'pointer',
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.1)',
        }
    },
    addIcon2: {
        color: '#f7c12d !important',
        paddingTop: '5px',
        fontSize: '1.6em',
        textAlign: 'center !important',
        verticalAlign: 'middle' ,
        cursor: 'pointer',
    },
}));

const AddMovie = (props) => {
    const [clicked, setClicked] = useState(false);

    // const [watchlist, setWatchlist] = useState(props.watchlist)
    const classes = useStyles();

    useEffect(() => {
        if (!clicked && props.watchlist && props.watchlist.length && props.id) {
            for (var j = 0; j < props.watchlist.length; j++) {
                if (props.id === props.watchlist[j]) {
                    setClicked(!clicked);
                }
            }
        }
    }, [props, clicked]);


    return (
        <Grid item xs={'auto'}>
            {clicked ? <HighlightOffIcon
                    fontSize="large"
                    className={props.movieCard ? classes.addIcon : classes.addIcon2}
                    onClick={() =>{setClicked(false) ; props.handleClickAddWatchlist(props.id, 'remove') }} id="removeCircle"/> :
                <AddCircle fontSize="large"   className={props.movieCard ? classes.addIcon : classes.addIcon2}onClick={() => { setClicked(true) ; props.handleClickAddWatchlist(props.id, 'add') }} id="addCircle"/>
            }
        </Grid>
    )

}

export default AddMovie;