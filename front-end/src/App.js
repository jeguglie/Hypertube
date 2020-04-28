import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import MovieCard from './components/MovieCard/MovieCard';
import 'react-notifications-component/dist/theme.css'
import ActiveAccount from './components/ActiveAccount/ActiveAccount';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ProfilePublic from './components/Profile/ProfilePublic';
import ReactNotification from 'react-notifications-component';
import { Route, Switch, Redirect, useHistory} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import Cookies from 'universal-cookie';
import Mylist from './components/Historic/Mylist';
import withAuth from './utils/withAuth'
const cookies = new Cookies();

// const cookies = new Cookies();
// const getLg = cookies.get('lg');
const useStyles = makeStyles(theme => ({
  topBackground: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '500px',
    width: '100%',
    zIndex: -1,
    background: 'linear-gradient(-180deg, #0d1c37 40%, rgba(0, 0, 0, 0) ) !important'
  }
}));

export default function App() {

  const homeRef = React.useRef();
  const menuRef = React.useRef();
  const signupRef = React.useRef();
  const movieRef = React.useRef();
  const loginRef = React.useRef();
  const profileRef = React.useRef();
  const MylistRef = React.useRef();
  const forgotRef = React.useRef();
  const resetRef = React.useRef();
  const profilePublicRef = React.useRef();
  const history = useHistory();
  const classes = useStyles();
  const [watchlist, setWatchlist] = React.useState([]);
  const [initialLanguage] = React.useState({
      language: cookies.get('lg') ? cookies.get('lg') : 'us',
      languageRequest: cookies.get('lg') === 'us' ? 'language=en-US' : 'language=fr-FR'
  });

  const handleActiveSidebar = (bool) => {
    if (history && history.location.pathname === '/'){
      homeRef.current && homeRef.current.setSidebar(bool);
    }
  };

  const handleSetWatchlist = (watchlist) => {setWatchlist(watchlist)};
  const handleInjectWatchlist = () => {
    homeRef.current && homeRef.current.setWatchlists(watchlist);
    MylistRef.current && MylistRef.current.setWatchlists(watchlist);
    profilePublicRef.current && profilePublicRef.current.setWatchlists(watchlist);
    movieRef.current && movieRef.current.setWatchlists(watchlist);

  };


  const handleSetLanguage = (setLang) => {
      let newLanguage = setLang.language === 'fr' ? {language: 'fr', languageRequest: 'language=fr-FR'} : {language: 'us', languageRequest: 'language=en-US'}
      menuRef.current && menuRef.current.setLanguageHandle(newLanguage);
      signupRef.current && signupRef.current.setLanguageHandle(newLanguage);
      loginRef.current && loginRef.current.setLanguageHandle(newLanguage);
      homeRef.current && homeRef.current.setLanguageHandle(newLanguage);
      movieRef.current && movieRef.current.setLanguageHandle(newLanguage);
      profileRef.current && profileRef.current.setLanguageHandle(newLanguage);
      MylistRef.current && MylistRef.current.setLanguageHandle(newLanguage);
      forgotRef.current && forgotRef.current.setLanguageHandle(newLanguage);
      resetRef.current && resetRef.current.setLanguageHandle(newLanguage);
      profilePublicRef.current && profilePublicRef.current.setLanguageHandle(newLanguage);

      cookies.set('lg', newLanguage.language, {path: '/'});
  };
  const handleSearchMovie = (query, value) => { homeRef.current && homeRef.current.setSearch(query, value) };
  return (
      <div id={"main"}>
        <div className={classes.topBackground} />
        <Menu
            history={history}
            ref={menuRef}
            injectWatchlist={handleInjectWatchlist}
            setLanguage={handleSetLanguage}
            setWatchlist={handleSetWatchlist}
            search={handleSearchMovie}
            setSidebar={handleActiveSidebar}
        />
        <div className={"notifications"}>
          <ReactNotification />
        </div>
        <Switch>
          <Route exact path="/movie/:movieId" component={withAuth((props => <MovieCard  injectWatchlist={handleInjectWatchlist} ref={movieRef} {...props} /> ))} />
        <Route exact path="/"
               component={withAuth((props) =>
                      <Home  {...props}
                             ref={homeRef}
                             injectWatchlist={handleInjectWatchlist}
                             setWatchlist={handleSetWatchlist}
                             setSidebar={handleActiveSidebar} />
              )}
          />
          <Route exact path="/historic" component={withAuth((props) => <Mylist {...props}  ref={MylistRef} injectWatchlist={handleInjectWatchlist} /> )} />
          <Route exact path="/profile" component={withAuth((props) => <Profile ref={profileRef} {...props}  /> )} />
          <Route exact path="/login" component={(props) => <Login {...props} ref={loginRef} /> }/>
          <Route exact path="/users/reset/:token" component={(props) => <ResetPassword ref={resetRef} {...props} />}/>
          <Route exact path="/users/active/:token" component={(props) => <ActiveAccount {...props} />}/>
          <Route exact path="/user/:username" component={withAuth((props) => <ProfilePublic ref={profilePublicRef} initialLanguage={initialLanguage} injectWatchlist={handleInjectWatchlist} {...props} /> )}/>
          <Route exact path="/signup" component={(props) => <Signup {...props} ref={signupRef}  />}/>
          <Route exact path="/forgot" component={(props) => <Forgot {...props} ref={forgotRef}/>} />
          <Redirect from="*" to=""/>
        </Switch>
      </div>
  );
};
