import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {ButtonGroup, Grow, Typography, TextField, Button, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import iconSet from './../Icon/selection.json';
import IcomoonReact from "icomoon-react";
import Logo from './../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import Cookies from 'universal-cookie';
import {store} from "react-notifications-component";
const cookies = new Cookies();


// Style
const useStyles = makeStyles(theme => ({
    loginContainer: {
        padding: '9em 0 0 0',
        margin: 'auto',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(5),
    },
    login: {
        marginTop: 'auto',
        background: 'white',
        borderRadius: '12px',
        padding: theme.spacing(3),
        boxShadow: '1px 1px 42px rgba(238, 28, 115,0.15);',
    },
    logo: {
        maxWidth: '100%',
        height: 'auto !important'
    },
    topContainerLogo: {
        background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(-3),
        padding: theme.spacing(3),
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',

    },
    signupButton: {
        background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    buttonFacebook: {
        '&:hover':{
            backgroundColor: '#35528d',
        },
        textTransform: 'none',
        backgroundColor: '#4267b2',
        color: 'white'
    },
    button42: {
        '&:hover':{
            backgroundColor: '#1f1f1f',
        },
        borderRight: 'none !important',
        textTransform: 'none',
        backgroundColor: '#000000',
        color: 'white'
    },
    buttonGroup: {
        margin: theme.spacing(0, 0, 3, 0),
        borderRadius: '10px !important',
        overflow: 'hidden'
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    signupItem: {
        textAlign: 'right !important',
    }
  }));


const Login = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);
    const [displayResend, setDisplayResend] = useState(false);
    const [language, setLanguage] = React.useState(() => {
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });

      const translate = {
          fr: {
              mailConfirmError: "Erreur pendant la géneration du token",
              dontHaveAccount: "Pas de compte ? S'inscrire",
              forgotPassword: "Mot de passe oublié ?",
              resendActivation: "Renvoyer un mail de confirmation",
              incorrect: "Nom d'utilisateur ou mot de passe incorrect",
              mailConfirm : "Un mail de confirmation à été envoyé",
              activeAccount: "Merci d'activer votre compte",
              SignIn: 'Se connecter',
              password: 'Mot de passe',
              username: 'Nom d\'utilisateur',
              errors: {
                  password_strong: 'Mot de passe trop faible',
                  password_required: 'Mot de passe requis',
                  username_incorrect: `Merci d'utiliser un nom valide`,
                  username: 'Nom d\'utilisateur invalide',
                  incorrect: `Nom d'utilisateur ou mot de passe invalide`,
              }
          },
          us: {
              mailConfirmError: "Error when trying to generate token",
              dontHaveAccount: "Don't have an account? Sign up",
              forgotPassword : "Forgot password ?",
              resendActivation: "Resend activation link",
              incorrect: 'Incorrect username or password',
              mailConfirm: "Mail confirmation was succesfully sent",
              activeAccount: 'Please active your account',
              SignIn: 'Sign in',
              password: 'Password',
              username: 'Username',
              errors: {
                  password_strong: 'Password must be strong',
                  password_required: 'Password required',
                  username: 'Please use valid username',
                  incorrect: `Invalid username or password`,
              }
          }
      };
      // Ref accessible by App.js
      useImperativeHandle(ref, () => ({
          setLanguageHandle(newLang) {
              setLanguage(newLang);
          }
      }));


    useEffect(() => {
        const cookies = new Cookies();
        let getToken = cookies.get('token');
        async function fetchAPI() {
           await API.withAuth()
               .then(res => {
                   if (res.status === 200) {
                       props.history.push('/');
                   }
               })
               .catch((err) => {
                   cookies.remove('token')
               })
       }
        if (getToken)
            fetchAPI();
    }, [props]);
    
    // Signup redirect
    const handleRedirectSignup = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/signup'); 
    };
    // Forgot password
    const handleRedirectForgot = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/forgot'); 
    };

    // HandleFacebookConnection
    const handleFacebookConnection = () => { API.facebookAuth() }
    // Handle42Connection
    const handle42Connection = () => { API.fortyTwoAuth() };

    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({ err_username: false, err_password: false });
    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({ username: '', password: ''})

      /* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
    const handleChange = (event) => {
        const { err_username, err_password } = validationErrors;
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });
    }
    // Signup
    const handleSignInClicked = (e) => {
        e.preventDefault();
        /* VALIDATION */
        const errors = { username: false, password: false }
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = translate[language.language].errors.username
        if (!fieldValue.password.length)
            errors.password = translate[language.language].errors.password_required;
        else if (!VALIDATION.validatePassword(fieldValue.password))
            errors.password = translate[language.language].errors.password_strong;
        setValidationErrors({ err_password: errors.password, err_username: errors.username });
        /* SEND REQUEST */
        if (!errors.username && !errors.password) {
            API.login(fieldValue.username, fieldValue.password)
            .then(response => {
                if (response.status === 200){
                    props.history.push('/')
                }
            })
            .catch(err => {
                if (err && err.response && err.response.data && err.response.data.active) {
                    store.addNotification({
                        message: translate[language.language].activeAccount,
                        insert: "top",
                        type: 'success',
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                    setDisplayResend(true);
                }
              if (err.response.status === 400) {
                  let incorrect = translate[language.language].errors.incorrect;
                  setValidationErrors({err_username: incorrect, err_password: false})
              }
            });
        }
    }

    const handleClickResend = async(e) => {
        e.preventDefault();
        const errors = { username: false }
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = 'Please use valid username';
        setValidationErrors({ err_username: errors.username });
        if (!errors.username) {
            await API.resendMail(fieldValue.username)
                .then(response => {
                    if (response.status === 200){
                        store.addNotification({
                            message: translate[language.language].mailConfirm,
                            insert: "top",
                            type: 'success',
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                    }
                })
                .catch(err => {
                    store.addNotification({
                        message: translate[language.language].mailConfirmError,
                        insert: "top",
                        type: 'success',
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                });
        }
    }
    return (
        <div className={classes.loginContainer}>
            <Grow in={mounted}>
                <Container className={classes.login} component="main" maxWidth="xs">
                    <div className={classes.topContainerLogo}>
                        <img
                            src={Logo}
                            className={classes.logo}
                            alt="Hypertube"
                        />
                    </div>
                    {/* <CssBaseline /> */}
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            {translate[language.language].SignIn}
                        </Typography>
                        <form className={classes.form} onSubmit={handleSignInClicked} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label={translate[language.language].username}
                                        name="username"
                                        autoComplete="username"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password) || Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label={translate[language.language].password}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.signupButton}
                                onClick={handleSignInClicked}
                            >
                                {translate[language.language].SignIn}
                            </Button>
                            {displayResend ?<Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.signupButton}
                                onClick={handleClickResend}
                            >
                                {translate[language.language].resendActivation}
                            </Button> : null}
                            <ButtonGroup 
                                    fullWidth 
                                    size="large"
                                    variant="contained"
                                    aria-label="contained primary button group" 
                                    className={classes.buttonGroup}>
                                <Button
                                    className={classes.button42}
                                    onClick={handle42Connection}>
                                    <IcomoonReact iconSet={iconSet} color="#ffff" size={22} icon="42" />
                                </Button>
                                <Button
                                    onClick={handleFacebookConnection}
                                    startIcon={<FacebookIcon />}
                                    className={classes.buttonFacebook}>
                                    Facebook
                                </Button>
                            </ButtonGroup>
                            <Grid container justify="center">
                                <Grid item xs={5}>
                                    <Link onClick={handleRedirectForgot} href="#" variant="body2">
                                        {translate[language.language].forgotPassword}
                                    </Link>
                                </Grid>
                                <Grid className={classes.signupItem} item xs={7}>
                                    <Link onClick={handleRedirectSignup} href="#" variant="body2">
                                        {translate[language.language].dontHaveAccount}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </Grow>
        </div>
        );
    }
));
export default Login;