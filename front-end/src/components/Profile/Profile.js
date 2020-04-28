import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
    Container,
    Divider,
    Grid,
    Avatar,
    TextField,
    Backdrop,
    CircularProgress,
    Fab,
    Checkbox, FormControlLabel
} from "@material-ui/core";
import ImageIcon from '@material-ui/icons/Image';
import classnames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import API from "../../utils/API";
import LockIcon from '@material-ui/icons/Lock';
import AddIcon from '@material-ui/icons/Add';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import InputAdornment from '@material-ui/core/InputAdornment';
import { store } from 'react-notifications-component';
import VALIDATION from "../../utils/validation";
import Cookies from "universal-cookie";
import useStyles from './style.js';
const defaultSrc = "https://i.ibb.co/hgvJPFb/default-Img-Profile.png";

const Profile = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [loader, setLoader] = useState(false);
    const [defaultImg, setDefaultImg] = useState(defaultSrc);
    const [editPassword, setEditPassword] = useState(false)
    const [language, setLanguage] = React.useState(() => {
        const cookies = new Cookies();
        let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
        return ({
                language: newLang,
                languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
        )
    });

    const translate = {
        fr: {
            fileWarning: "Désolé, nous acceptons uniquement jpg, jpeg, png / taille limite 2mb",
            MyProfile: "Mon profil",
            firstname: 'Prénom',
            lastname: 'Nom',
            email: 'Adresse e-mail',
            password: 'Mot de passe',
            password_confirm: 'Confirmation',
            username: "Nom d'utilisateur",
            errors: {
                fileWarning: "Désolé, nous acceptons uniquement jpg, jpeg, png / taille limite 2mb",
                email: "Merci d'utiliser une adresse e-mail valide",
                firstname: "Merci d'utiliser un prénom valide",
                lastname: "Merci d'utiliser un nom valide",
                password_strong: 'Mot de passe trop faible',
                password_required: 'Mot de passe requis',
                username: "Merci d'utiliser un nom d'utilisateur valide",
                password_confirm: 'Les mots de passe ne correspondent pas',
                usernameExist: "Nom d'utilisateur déjà pris",
                emailExist: "E-mail déjà pris"
            },
            useDefault: 'Image par défaut',
            addPicture: 'Ajouter une image',
            editPassword: 'Editer mot de passe',
            saveChanges: 'Sauvegarder'
        },
        us: {
            fileWarning: "Sorry, we only accept jpg, jpeg, png and max file size of 2mb",
            mailConfirmation: "A mail confirmation was send. Please active your account.",
            MyProfile: "My profile",
            firstname: 'First name',
            lastname: 'Last name',
            email: 'Email Address',
            password: 'Password',
            password_confirm: 'Confirm password',
            username: 'Username',
            errors: {
                fileWarning: "Sorry, we only accept jpg, jpeg, png and max file size of 2mb",
                email: 'Please use valid email',
                firstname: 'Please use valid first name',
                lastname: 'Please use valid last name',
                password_strong: 'Password must be strong',
                password_required: 'Password required',
                username: 'Please use valid username',
                password_confirm: 'Passwords must match',
                usernameExist: 'Username already exist',
                emailExist: 'Email already exist'
            },
            useDefault: 'Use default image',
            addPicture: 'Add picture',
            editPassword: 'Edit password',
            saveChanges: 'Save changes'
        }
    };


    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        }
    }));

    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({
        err_firstname: false,
        err_lastname: false,
        err_email: false,
        err_password: false,
        err_username: false,
        err_password_confirm: false,
    });
    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirm: '',
        username: '',
    });

    const handleEditPassword = () => {
        setEditPassword(!editPassword);
        setValidationErrors({
            err_password_confirm: false,
            err_password: false
        })
    }

    const handleChange = (event) => {
        const {err_email, err_password, err_firstname, err_lastname, err_username, err_password_confirm} = validationErrors;
        if (event.target.id === "email" && err_email)
            setValidationErrors({...validationErrors, err_email: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        if (event.target.id === "firstname" && err_firstname)
            setValidationErrors({...validationErrors, err_firstname: false});
        if (event.target.id === "password_confirm" && err_password_confirm)
            setValidationErrors({...validationErrors, err_firstname: false});
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "lastname" && err_lastname)
            setValidationErrors({...validationErrors, err_lastname: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value});
    };

    const handleSaveChanges = async () => {
        setLoader(true);
        /* VALIDATION */
        const errors = {
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            password_confirm: false,
            username: false,
        }
        if (!VALIDATION.validateEmail(fieldValue.email))
            errors.email = translate[language.language].errors.email
        if (!VALIDATION.validateName(fieldValue.firstname))
            errors.firstname = translate[language.language].errors.firstname
        if (!VALIDATION.validateName(fieldValue.lastname))
            errors.lastname = translate[language.language].errors.lastname
        if (editPassword && (!fieldValue.password || !fieldValue.password.length))
            errors.password = translate[language.language].errors.password
        else if (editPassword && !VALIDATION.validatePassword(fieldValue.password))
            errors.password = translate[language.language].errors.password_strong
        if (editPassword && fieldValue.password !== fieldValue.password_confirm)
            errors.password_confirm = translate[language.language].errors.password_confirm
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = translate[language.language].errors.username
        setValidationErrors({
            err_password: errors.password,
            err_password_confirm: errors.password_confirm,
            err_email: errors.email,
            err_firstname: errors.firstname,
            err_lastname: errors.lastname,
            err_username: errors.username
        });
        /* SEND REQUEST */
        if (!errors.firstname && !errors.lastname && !errors.email && !errors.password && !errors.username && !errors.password_confirm) {
            let img;
            if (defaultSrc === defaultImg) img = true;
            else img = !Boolean(defaultImg);
            await API.updateUserProfil(fieldValue.firstname, fieldValue.lastname, fieldValue.username, fieldValue.email, fieldValue.password, fieldValue.password_confirm, img, editPassword)
                .catch(err => {
                    if (err.response.data){
                        setValidationErrors({
                            ...validationErrors,
                            err_username: err.response.data.err_username ?  translate[language.language].errors.usernameExist : false,
                            err_email: err.response.data.err_email ? translate[language.language].errors.emailExist : false
                        })
                    }
                    console.log(err.response.data);
                });
        }
        setLoader(false);
    }

    useEffect(() => {
        let mounted = true;
        async function getUserProfile() {
            await API.getUserProfile()
                .then(res => {
                    if (res.status === 200 && res.data) {
                        mounted && setTextFieldsValues({
                            firstname: res.data.firstname,
                            lastname: res.data.lastname,
                            username: res.data.username,
                            email: res.data.email
                        })
                        mounted && setDefaultImg(res.data.img);
                        mounted && setMounted(true);
                    }
                })
        }
        mounted && getUserProfile();
        return () => mounted = false;
    }, []);

    const handleNotifFile = () => {
        store.addNotification({
            message:  translate[language.language].errors.fileWarning,
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

    const imagesFilesUpload = async (e) => {
        const cookies = new Cookies();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileSize = Math.round((file.size / 1024));
            if ((fileSize >= 4096) || (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg'))
                handleNotifFile();
            else {
                const formData = new FormData();
                formData.append('file', file);
                await API.updatePicture(formData, cookies.get('token'))
                    .then(res => {
                        if (res.status === 200 && res.data.img)
                            setDefaultImg(res.data.img);
                    })
                    .catch(err => {
                        handleNotifFile();
                    });
            }
        }
    };

    const handleCheckboxImg = () => {
        setDefaultImg(defaultSrc);
    };
    return (
        <Container component="main" maxWidth={"md"} className={classes.containerGridTopMovie}>
            <form noValidate>
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={!mounted}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language.language].MyProfile}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <div className={classes.profileContainer}>
                    <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row"
                          justify="space-evenly" alignItems="center">
                        <Grid item sm={6}>
                            <Grid container direction={"column"} alignItems="center" alignContent={'center'}>
                                <Grid item>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={defaultImg}
                                        className={classes.large}
                                    />
                                </Grid>
                                <Grid item>
                                    <div className={classes.imageUploadWrap}>
                                        <Fab variant="extended" size="small" className={classes.addPicture}>
                                            <AddIcon/>
                                            {translate[language.language].addPicture}
                                        </Fab>
                                        <input
                                            className={classes.fileUploadInput}
                                            type="file"
                                            onChange={imagesFilesUpload}
                                            accept="image/png, image/jpg, image/jpeg"
                                        />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <Fab onClick={handleCheckboxImg} variant="extended" size="small"
                                         className={classes.addPicture}>
                                        <ImageIcon/>
                                        {translate[language.language].useDefault}
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={6}>
                            <Grid className={classes.containerInfos} container direction={"column"} alignItems="stretch"
                                  alignContent={'center'}>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.firstname || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_firstname}
                                        error={Boolean(validationErrors.err_firstname)}
                                        name="firstname"
                                        variant="filled"
                                        required
                                        id="firstname"
                                        label={translate[language.language].firstname}
                                        className={classes.textfield}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.lastname || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_lastname}
                                        error={Boolean(validationErrors.err_lastname)}
                                        name="lastname"
                                        variant="filled"
                                        fullWidth
                                        id="lastname"
                                        required
                                        label={translate[language.language].lastname}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.username || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        name="username"
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label={translate[language.language].username}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.password || ''}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password)}
                                        onChange={handleChange}
                                        variant="filled"
                                        fullWidth
                                        name="password"
                                        label={translate[language.language].password}
                                        type="password"
                                        id="password"
                                        required={editPassword}
                                        disabled={!editPassword}
                                        autoComplete={"true"}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.password_confirm || ''}
                                        helperText={validationErrors.err_password_confirm}
                                        error={Boolean(validationErrors.err_password_confirm)}
                                        onChange={handleChange}
                                        variant="filled"
                                        fullWidth
                                        name="password_confirm"
                                        label={translate[language.language].password_confirm}
                                        type="password"
                                        id="password_confirm"
                                        autoComplete={"true"}
                                        disabled={!editPassword}
                                        required={editPassword}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.email || ''}
                                        helperText={validationErrors.err_email}
                                        error={Boolean(validationErrors.err_email)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        label={translate[language.language].email}
                                        name="email"
                                        className={classnames(classes.textfield, classes.textfieldbottom)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid style={{marginTop: '3em'}} container alignContent={'center'} justify={'center'}
                          alignItems={'center'}>
                        <Grid item>
                            <div className={classes.containerBottomButtons}>
                                <Fab onClick={handleEditPassword} variant="extended" size="medium"
                                     className={classes.saveChanges} style={{marginRight: '10px'}}>
                                    <FormControlLabel
                                        className={classes.FormControlLabel}
                                        checked={editPassword}
                                        onClick={handleEditPassword}
                                        value={translate[language.language].editPassword}
                                        control={<Checkbox color="primary"/>}
                                        label={translate[language.language].editPassword}
                                        labelPlacement="start"
                                    />
                                </Fab>
                                <Fab onClick={handleSaveChanges} variant="extended" size="medium"
                                     className={classes.saveChanges}>
                                    {loader ? <CircularProgress size={24} className={classes.commentProgress}/> :
                                        <CheckIcon/>}
                                    {loader ? null : translate[language.language].saveChanges}
                                </Fab>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </Container>
    )
}));

export default Profile;