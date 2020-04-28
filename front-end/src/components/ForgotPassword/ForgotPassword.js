import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Grow, Typography, TextField, Button, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import {store} from "react-notifications-component";
import Cookies from "universal-cookie";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

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
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: theme.spacing(3),
        boxShadow: '1px 1px 42px rgba(238, 28, 115,0.2);',
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
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
        }
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    }
}));


const ForgotPassword = (forwardRef((props, ref) => {
        const classes = useStyles();
        const [mounted, setMounted] = useState(true);
        const [loader, setLoader] = useState(false);
        const cookies = new Cookies();
        const [language, setLanguage] = React.useState(() => {
            let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
            return ({
                    language: newLang,
                    languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'
                }
            )
        });
    const [validationErrors, setValidationErrors] = React.useState({err_email: false });
    const [fieldValue, setTextFieldsValues] = React.useState({ email: ''});

        const translate = {
            fr: {
                forgotTitle: "Mot de passe oublié",
                sendmail: "Envoyer le mail de réinitilisation",
                mail: "Adresse e-mail",
                mailError: "Merci d'utiliser un mail valide",
                mailSent: "Un mail de confirmation à été envoyé",
                noAccount: "Vous n'avez pas de compte ? Inscrivez-vous"
            },
            us: {
                forgotTitle: "Forgot password",
                sendmail: "Send reset mail",
                mail: "Email Address",
                mailError: "Please use valid email",
                mailSent: "A mail confirmation was sent",
                noAccount: "Don't have an account ? Sign up"
            }
        }

        // Ref accessible by App.js
        useImperativeHandle(ref, () => ({
            setLanguageHandle(newLang) {
                setLanguage(newLang);
            }
        }));

        const handleRedirectSignup = (e) => {
            setMounted(!mounted);
            e.preventDefault();
            props.history.push('/signup');
        };

        const handleChange = (event) => {
            const {err_email} = validationErrors;
            if (event.target.id === "email" && err_email)
                setValidationErrors({...validationErrors, err_email: false});
            setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });

        };

        const handleMailSend = (e) => {
            e.preventDefault();
            if (fieldValue && fieldValue.email && fieldValue.email.length) {
                setLoader(true);
                if (fieldValue.email && fieldValue.email.length && !VALIDATION.validateEmail(fieldValue.email))
                    setValidationErrors({err_mail: translate[language.language].mailError});
                if (!validationErrors.err_email) {
                    API.sendResetMail(fieldValue.email)
                        .then(res => {
                            if (res.status === 200) {
                                store.addNotification({
                                    message: translate[language.language].mailSent,
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
                                setLoader(false);
                                props.history.push('/login');
                            }
                        })
                        .catch(() => { setLoader(false); setValidationErrors({err_email: translate[language.language].mailError}) })
                }
                else {
                    setLoader(false);
                    setValidationErrors({err_email: translate[language.language].mailError})
                }
            }
        };
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
                                {translate[language.language].forgotTitle}
                            </Typography>
                            <form className={classes.form} onSubmit={handleMailSend} noValidate>
                                <Grid alignContent="center" alignItems="center" container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="filled"
                                            required
                                            fullWidth
                                            helperText={validationErrors.err_email}
                                            error={Boolean(validationErrors.err_email)}
                                            id="email"
                                            label={translate[language.language].mail}
                                            name="email"
                                            autoComplete="email"
                                            className={classes.textfield}
                                            value={fieldValue.email || ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    disabled={loader}
                                    className={classes.signupButton}
                                    onClick={handleMailSend}
                                >
                                    {loader ? <CircularProgress variant="indeterminate" style={{color: 'white'}} size={30} /> :
                                        translate[language.language].sendmail}
                                </Button>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link onClick={handleRedirectSignup} href="#" variant="body2">
                                            {translate[language.language].noAccount}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Container>
                </Grow>
            </div>
        );
    }));

export default ForgotPassword;