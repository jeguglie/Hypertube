import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { 
    Drawer, 
    Button, 
    Slider, 
    Typography, 
    IconButton,
    TextField,
    Grid,
    Divider, 
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import axios from "axios";
import Cookies from "universal-cookie";

const useStyles = makeStyles(() => ({
    drawerPaper:{
        background: 'linear-gradient(-333deg, rgba(32, 122, 244, 0.8) -39%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 0.8) 223% ) !important',
        opacity: '0.97',
        boxShadow: '1px -7px 22px 11px rgba(0,0,0,0.5)'
    },
    sidebarHomeContainer: {
        width: '15em',
        padding: '1.5em'
    },
    actorResearch: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
              borderRadius: '10px',
              opacity: '0',
              color: 'white'
            }
        },
        '& input::placeholder': {
            color: 'white'
        },
        '& .MuiSvgIcon-root': {
            color: 'white'
        }
    },
    buttonSearch: {
        color: 'white',
        background: '#3f51b5',
        '&:hover': {
            background: '#344594',
        }
    }
}));


const PrettoSlider = withStyles({
    root: {
        backgroundColor: 'linear-gradient(-333deg, rgba(32, 122, 244, 0.8) -39%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 0.8) 223% ) !important',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        fontSize: '0.8em',
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
        
    },
    rail: {

        height: 8,
        borderRadius: 4,
    },
})(Slider);
const key = 'f29f2233f1aa782b0f0dc8d6d9493c64';


const SidebarHome = (forwardRef((props, ref) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [yearValue, setYearValue] = useState(2019);
    const [voteValue, setVoteValue] = useState(5);
    const [genreValues, setGenresValue] = useState([])
        const cookies = new Cookies();
        const [language, setLanguage] = React.useState(() => {
            let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
            return ({
                    language: newLang,
                    languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
            )
        });
    const [translate] = useState({
        fr: {
            Searchfilters: 'Filtre',
            year: 'Année',
            Vote: 'Note',
            Genres: 'Genre(s)',
            GenresAdd: 'Ajouter genre(s)',
            Search: 'Rechercher'
        },
        us: {
            Searchfilters: 'Search filters',
            year: 'Year',
            Vote: 'Vote',
            Genres: 'Genre(s)',
            GenresAdd: 'Add genre(s)',
            Search: 'Search'
        }});
    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            if(language)
                setLanguage(language);
        }
    }));


        // ON LOAD - get movies genres
        useEffect(() => {
            let mounted = true;
            const getMoviesGenres = async(language) =>{
                let data = [];
                await axios.get(`https://api.themoviedb.org/3/genre/movie/list?${language.languageRequest}&api_key=${key}`)
                    .then(res => {
                        if (res.data && res.data.genres && res.data.genres.length)
                            data = res.data.genres;
                    })
                return data;
            };
            const callGetMoviesGenres = async () => {
                let data = await getMoviesGenres(language);
                mounted && setGenres(data);
            };
            callGetMoviesGenres();
            return () => {mounted = false;}
        }, [language])

        // Receive active (bool) from Parent (Menu --> App --> Home)
    useEffect(() => {
        setOpen(props.sidebarActive)
    }, [props.sidebarActive]);

    // Handle changes genres
        const handleGenresChange = (event, newValue) => { newValue !== voteValue && setGenresValue(newValue) };
    // Handle changes sliders
        // Vote handle change
        const handleVoteChange = (event, newValue) => { newValue !== voteValue && setVoteValue(newValue) };
         // Year handle change
        const handleYearChange = (event, newValue) => { newValue !== yearValue && setYearValue(newValue) };

    // Handle search submit
        const handleSubmitSearch = () => {
            let genresTab = '';
            const baseURL= 'https://api.themoviedb.org/3/discover/movie?';
            const apiKey = 'api_key=f29f2233f1aa782b0f0dc8d6d9493c64';
            const lg = language === 'us' ? 'language=en-US' : 'language=fr';
            const voteFilter = 'vote_average.gte=';
            const voteAverage = voteValue * 2;
            const year = `primary_release_year=${yearValue}`
            const includeAdult = 'include_adult=false';
            if (genreValues && genreValues.length)
                genresTab = genreValues.map((obj) => { return obj.id }).join(',');
            const query = `${baseURL}${apiKey}&${lg}&${year}&${voteFilter}${voteAverage}&${includeAdult}&with_genres=${genresTab}&page=`;
            props.pushQuery(query);
          
        };


    if (language)
        return (
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                classes={{ paper: classes.drawerPaper }}
                onClose={props.sidebarClose}
            >
                <div className={classes.drawerHeader}>
                    <Grid container direction="row" alignContent="flex-end" justify="space-between" alignItems={"center"}>
                        <Grid item xs={6} style={{padding: '12px'}}>
                            <Typography style={{color: 'white', fontSize: '1.2em', fontWeight: 'bold', verticalAlign: 'middle'}}> {translate[language.language].Search}</Typography>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <IconButton onClick={props.sidebarClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon style={{color: 'white'}} fontSize="large"/> : <ChevronRightIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
                <Divider style={{background: 'linear-gradient(90deg, #3f51b5, rgba(255,255,255,0))'}}/>
                <div className={classes.sidebarHomeContainer}>
                    <Typography gutterBottom style={{color: 'white'}}>
                        {translate[language.language].year}
                    </Typography>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        min={1910} max={2020}
                        defaultValue={2019}
                        onChange={handleYearChange}
                    />
                    <Typography  gutterBottom style={{color: 'white'}}>{translate[language.language].Vote}</Typography>
                    <PrettoSlider
                        onChange={handleVoteChange}
                        valueLabelDisplay="auto"
                        min={0} max={5}
                        defaultValue={5}
                        step={1}
                    />
                    <Typography gutterBottom style={{color: 'white'}}>{translate[language.language].Genres}</Typography>
                    <Autocomplete
                        style={{color: 'white'}}
                        multiple
                        options={genres}
                        getOptionLabel={genres => genres.name}
                        filterSelectedOptions
                        onChange={handleGenresChange}
                        renderInput={params => (
                        <TextField
                            {...params}
                            className={classes.actorResearch}
                            variant="outlined"
                            placeholder={translate[language.language].GenresAdd}
                        />
                        )}
                    />
                    <div style={{ textAlign: 'left'}}>
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                            <Grid item xs={12}>
                                <Button
                                    style={{marginTop: '13px'}}
                                    variant="contained"
                                    size="medium"
                                    onClick={handleSubmitSearch}
                                    className={classes.buttonSearch}
                                >
                                    {translate[language.language].Search}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Drawer>
        )
    return null
}
));

export default SidebarHome;