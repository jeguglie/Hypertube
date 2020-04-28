import React, {forwardRef, useImperativeHandle} from 'react';
import {Grow, Typography, TextField, Button, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from './../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import {store} from "react-notifications-component";
import Cookies from "universal-cookie";

// Style
const useStyles = makeStyles(theme => ({
    forgotContainer: {
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
        margin: theme.spacing(3, 0, 0, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    signupItem: {
        textAlign: 'right !important',
    }
}));


const ResetPassword = (forwardRef((props, ref) => {
    const classes = useStyles();

    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({
        err_username: false,
        err_password: false,
        err_password_confirm: false
    });

    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({username: '', password: '', password_confirm: ''})

    /* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
    const handleChange = (event) => {
        const {err_username, err_password, err_password_confirm} = validationErrors;
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        if (event.target.id === "password_confirm" && err_password_confirm)
            setValidationErrors({...validationErrors, err_password: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value});
    };

    const cookies = new Cookies();
    const [language, setLanguage] = React.useState(() => {
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'
            }
        )
    });

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        }
    }));

    const translate = {
        fr: {
            errors: {
                username: "Nom d'utilisateur invalide",
                password: "Mot de passe requis",
                passwordConfirm: "Les mots de passe ne correspondent pas",
                passwordStrong: "Mot de passe trop faible"
            },
            password: "Mot de passe",
            password_confirm : "Confirmer mot de passe",
            username: "Nom d'utilisateur",
            success:  "Votre mot de passe à été réinitialisé avec succès",
            error: "Une erreur s'est produite",
            title: "Réinitaliser mon mot de passe",
            button: "Confirmer"
        },
        us: {
            errors: {
                username: "Username not valid",
                password: "Password required",
                passwordConfirm: "Passwords must match",
                passwordStrong: "Password must by strong"
            },
            password: "Password",
            password_confirm : "Password confirm",
            username: "Username",
            success:  "Your password has been reset with success",
            error: "An error occured",
            title: "Reset my password",
            button: "Confirm"
        },
    }

    const handleResetClicked = (e) => {
        e.preventDefault();
        const errors = {username: false, password: false, password_confirm: false}

        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = translate[language.language].errors.username;
        if (!fieldValue.password.length)
            errors.password = translate[language.language].errors.password;
        if (fieldValue.password !== fieldValue.password_confirm)
            errors.password_confirm = translate[language.language].errors.passwordConfirm;
        else if (!VALIDATION.validatePassword(fieldValue.password))
            errors.password = translate[language.language].errors.passwordStrong;
        setValidationErrors({
            err_password: translate[language.language].errors.password,
            err_username: translate[language.language].errors.username,
            err_password_confirm: translate[language.language].errors.password_confirm
        });

        if (!errors.username && !errors.password && !errors.password_confirm) {
            API.resetPassword(props.match.params.token, fieldValue.password, fieldValue.password_confirm, fieldValue.username)
                .then(response => {
                    if (response.status === 200) {
                        store.addNotification({
                            message: translate[language.language].success,
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
                        props.history.push('/')
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.errors)
                        setValidationErrors({
                            err_password: err.response.data.errors.password,
                            err_password_confirm: err.response.data.errors.password_confirm,
                        });
                    else {
                        store.addNotification({
                            message: translate[language.language].error,
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
                        props.history.push('/')
                    }
                });
        }
    };
    return (
        <div className={classes.forgotContainer}>
            <Grow in={true}>
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
                            {translate[language.language].title}
                        </Typography>
                        <form className={classes.form} onSubmit={handleResetClicked} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        value={fieldValue.username || ''}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        label={translate[language.language].username}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        name="username"
                                        autoComplete="username"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={fieldValue.password || ''}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password)}
                                        label={translate[language.language].password}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={fieldValue.password_confirm || ''}
                                        helperText={validationErrors.err_password_confirm}
                                        error={Boolean(validationErrors.err_password_confirm)}
                                        label={translate[language.language].password_confirm}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password_confirm"
                                        type="password"
                                        id="password_confirm"
                                        autoComplete="current-password"
                                        className={classes.textfield}
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
                            >
                                {translate[language.language].button}
                            </Button>
                        </form>
                    </div>
                </Container>
            </Grow>
        </div>
    );
}
));

export default ResetPassword;