import React, {useState, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import StarRatings from 'react-star-ratings';
import { Grow, Grid } from '@material-ui/core';
import API from './../../utils/API';
import { store } from 'react-notifications-component';
import Cookies from "universal-cookie";
import AddMovie from './AddMovie'
import axios from 'axios';
import useStyles from './style';
const key = 'f29f2233f1aa782b0f0dc8d6d9493c64';

const translate = {
	fr: {
		messageRemoved: "Le film a bien été retiré de votre liste",
		messageAdd: "Le film a bien été ajouté à votre liste",
		addTooltip: 'Ajouter à ma liste'
	},
	us:{
		messageRemoved: "Movie was successfully removed from watch list",
		messageAdd: "Movie was successfully added from watch list",
		addTooltip: 'Add to my list'

	}
};


async function transformWatchlist(watchlist, language) {
	let watchlistTab = [];
	if (watchlist && watchlist.length){
		for(let i = 0; i < watchlist.length; i++){
			const id = watchlist[i]
			await axios.get(`https://api.themoviedb.org/3/movie/${id}?${language.languageRequest}&api_key=c91b62254304ec5dbb322351b0dc1094`)
				.then(res => {
					if (res.status === 200 && res.data && res.data.imdb_id) { watchlistTab.push(res.data) }
				});
		}
	}
	return watchlistTab.reverse();
};

const MoviesCardsGenerator = (forwardRef((props, ref) => {
	const classes = useStyles();
	const [movieFocus, setMovieFocus] = useState(false);
	const [moviesList, setMoviesList] = useState(false);
	const [moviesGenres, setMoviesGenres] = useState(false);
	const [activeTextAutoScroll, setActiveTextAutoScroll] = useState(false);
	const [watchlist, setWatchlist] = useState([]);
	const [isMylist, setMylist] = useState(false)
	const cookies = new Cookies();
	const [language, setLanguage] = React.useState(() => {
		let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
		return ({
			language: newLang,
			languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
		)
	});
	// Movie:hover
	const handleMouseEnterMovie = (key) => {
		setMovieFocus(key)
	};
	const handleMouseLeaveMovie = () => {
		setMovieFocus(false)
	};
	// Ref accessible by Home.js
	useImperativeHandle(ref, () => ({
		setLanguageHandle(language) {
			setLanguage(language);
		},
	}));



	// ON LOAD - Ref callback, when text overview is loaded, then check if he his too height (then set animation)
	const refText = useCallback(node => {
		if (node !== null) {
			if (node.clientHeight < node.scrollHeight)
				setActiveTextAutoScroll(false);
			else
				setActiveTextAutoScroll(true);
		}
	}, []);

	// ON LOAD - get movies genres
	useEffect(() => {
		let mounted = true;
		const getMoviesGenres = async(language) =>{
			let data = [];
			await axios.get(`https://api.themoviedb.org/3/genre/movie/list?${language.languageRequest}&api_key=${key}`)
				.then(res => {
					if (res.data && res.data.genres && res.data.genres.length) {
						data = res.data.genres;
					}
				})
			return data;
		};
		const callGetMoviesGenres = async () => {
			let data = await getMoviesGenres(language);
			mounted && setMoviesGenres(data);
		};
		callGetMoviesGenres();
		return () => {mounted = false;}
	}, [language])



	useEffect(() => {
		let mounted = true;
		async function setTransformWatchlist(isMylist, watchlist) {
			if (isMylist) {
				let data = await transformWatchlist(watchlist, language);
				mounted && setMoviesList(data);
			} else
				mounted && setMoviesList(props.moviesList);
		}

		if (props.moviesList && props.watchlist) {
			mounted && setWatchlist(props.watchlist);
			mounted && setMylist(props.Mylist);
			mounted && setTransformWatchlist(props.Mylist, props.moviesList);
		}
		return () => {mounted = false;}
	}, [props.moviesList, props.Mylist, props.watchlist, language])


	// Movies genres generator
	const genMovieGenres = (obj) => {
		if (moviesGenres && moviesGenres.length && !obj.genres) {
			return moviesGenres.map((genre) => {
				if (obj.genre_ids && Object.keys(obj.genre_ids.length)) {
					return Object.keys(obj.genre_ids).map((genreO, key) => {
						if (obj.genre_ids[key] === genre.id)
							return key < 4 ?
								<Grid key={key} className={classes.moviesGenres} item>
								<span>{genre.name}</span>
								</Grid> : null;
						return null
					});
				}
				return null
			});
		} else {
			if (obj.genres && obj.genres.length){
				return obj.genres.map((genreO, key) => {
					return key < 4 ?
						<Grid key={key} className={classes.moviesGenres} item>
						<span>{genreO.name}</span>
						</Grid> : null;
				});
			}
			else
				return null
		}
	};

	// const createWatchlistEntry = async (id) => {
	//     const cookies = new Cookies();
	//     let lang = cookies.get('lg');
	//     const lg = lang === 'us' ? 'language=en-US' : 'language=fr-FR';
	//     try {
	//         let data = await axios.get(`https://api.themoviedb.org/3/movie/${id}?${lg}&api_key=c91b62254304ec5dbb322351b0dc1094`)
	//         if (data && data.res.status === 200)
	//             return data.res.data;
	//     } catch (err) {
	//         return null;
	//     }
	// };

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
			setMoviesList(moviesList);
			props.updateWatchlist(watchlist);
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
			props.updateWatchlist(watchlist);
		}
	};

	function GridMovies(obj, key) {
		return (
			<Grid key={key} id={key === 1 ? "back-to-top-anchor" : null} item>
			<Grow in={true} className={classes.growContainer}>
			{/* Movie Card Item*/}
			<div>
			{movieFocus !== key ?
				<div className={classes.movieCoverContainer} onClick={() => handleMouseEnterMovie(key)} onMouseLeave={() => handleMouseLeaveMovie(key)}
				onMouseEnter={() => handleMouseEnterMovie(key)}>
				<img
				src={obj.poster_path ? `https://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
				alt={obj.title}
				className={classes.movieCover}
				/>
				</div> :
				<div className={classes.movieCoverContainer}
				onMouseLeave={() => handleMouseLeaveMovie(key)}>
				{/* Movie Card Focus */}
				<img
				src={obj.poster_path ? `https://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
				alt={obj.title}
				className={classes.movieCoverFocus}
				/>
				<div className={classes.movieFocusOverlay}>
				<Grid alignItems="flex-start" direction="column" alignContent="flex-start"
				justify="center" container>
				<Grid container direction="row" justify="center" alignContent="flex-start"
				alignItems="center">
				<Grid className={classes.topDateStarsAddContainer} alignItems="center"
				direction="row" justify="center" container>
				<Grid item xs={3}>
				<span
				className={classes.releaseDate}>{obj.release_date && obj.release_date.slice(0, 4)}</span>
				</Grid>
				<Grid item xs={6} className={classes.movieRating}>
				<StarRatings rating={obj.vote_average / 2} starRatedColor="#f7c12d"
				starDimension="14px" starSpacing="0.5px"/>
				</Grid>
				<AddMovie handleClickAddWatchlist={handleClickAddWatchlist}
				watchlist={watchlist} id={obj.id} movieCard={false} />
				</Grid>
				</Grid>
				<Grid item>
				<div className={classes.movieTitleContainer}>
				<h3 className={classes.movieTitle}>{obj.title}</h3>
				</div>
				</Grid>
				<Grid item>
				<div ref={refText} className={classes.movieOverviewContainer}>
				<p className={!activeTextAutoScroll ? classes.movieOverview : classes.movieOverviewNoScroll}>
				{obj.overview}
				</p>
				</div>
				</Grid>
				<Grid item className={classes.moviesGenreContainer}>
				<Grid container direction="row" justify="flex-start"
				alignItems="flex-start">
				{genMovieGenres(obj)}
				</Grid>
				</Grid>
				<Grid alignItems="flex-end" direction="column" justify="flex-end" container>
				<Grid item xs>
				<a href={'#  '}>
				<PlayCircleFilled
				className={classes.buttonWatch}
				onClick={(e) => {
					e.preventDefault();
					props.pushHistory(`/movie/${obj.id}`, e)
				}}
				/>
				</a>
				</Grid>
				</Grid>
				</Grid>
				</div>
				</div>
			}
			</div>
			</Grow>
			</Grid>
		)
	}

	if (!isMylist)
		return (
			<div>
			<Grid direction="row" alignItems="flex-start" justify="center" container className={classes.root}
			spacing={2}>
			{moviesList && moviesList.map((obj, key) => {
				return (GridMovies(obj, key))
			})}
			</Grid>
			</div>
		)
	else {
		return (
			<div>
			<Grid direction="row" wrap='nowrap' alignItems="flex-start" justify="flex-start"
			alignContent="flex-start" container spacing={2}
			style={{overflowX: 'auto',}}
			>
			{moviesList && moviesList.map((obj, key) => {
				return (GridMovies(obj, key))
			})}
			</Grid>
			</div>
		)
	}
}
));
export default MoviesCardsGenerator;
