import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {
	Grow,
	ButtonGroup,
	Fab,
	Typography,
	TextField,
	Button,
	Container,
	Grid,
	Link,
	Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import iconSet from './../Icon/selection.json';
import FacebookIcon from '@material-ui/icons/Facebook';
import IcomoonReact from "icomoon-react";
import Logo from './../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import Cookies from "universal-cookie";
import ImageIcon from '@material-ui/icons/Image';
import {store} from "react-notifications-component";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

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
		backgroundColor: 'white',
		borderRadius: '12px',
		padding: theme.spacing(3),
		boxShadow: '1px 1px 42px rgba(238, 28, 115,0.15§);',
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
	buttonGroup: {
		margin: theme.spacing(0, 0, 3, 0),
		borderRadius: '10px !important',
		overflow: 'hidden'
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
	textfield: {
		'& fieldset': {
			borderRadius: '10px !important',
		},
		'& .MuiFormHelperText-contained':{
			color: 'red'
		}
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	imagePreviewContainer: {
		width: '100%',
		height: '150px',
		overflow: 'hidden',
		backgroundClip: 'content-box',
		position: 'relative',
		borderRadius: '10px'

	},
	imagePreview: {
		display: 'block',
		// position: 'absolute',
		top: '50%',
		left: '50%',
		minHeight: '100%',
		minWidth: '100%',
		transform: 'translate(-50%, -50%)'
	},
	addPicture: {
		background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% ) !important',
		color: 'white',
		textAlign: 'center',
		marginBottom: '15px',
		padding: '5px !important',
		height: '100% !important'
	},
	itemsPhotos: {
		textAlign: 'center'
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
	large: {
		textAlign: 'center',
		width: '8em',
		height: '8em',
		margin: '0 auto',
	},

}));
const defaultSrc = "https://i.ibb.co/hgvJPFb/default-Img-Profile.png";


const Signup = (forwardRef((props, ref) => {
	const classes = useStyles();

	const [file, setFile] = React.useState('');
	const cookies = new Cookies();
	const [language, setLanguage] = React.useState(() => {
		let newLang = cookies.get('lg') ? cookies.get('lg') : 'us';
		return ({
			language: newLang,
			languageRequest: newLang !== 'us' ? 'language=fr-FR' : 'language=en-US'}
		)
	});

	const translate = {
		fr: {
			fileWarning: "Désolé, nous acceptons uniquement jpg, jpeg, png / taille limite 2mb",
			mailConfirmation : "Un mail de confirmation vient d'être envoyé.",
			SignUp: "S'inscrire",
			firstname: 'Prénom',
			lastname: 'Nom',
			email: 'Adresse e-mail',
			password: 'Mot de passe',
			password_confirm: 'Confirmation',
			username: "Nom d'utilisateur",
			HaveAccount: "Vous possédez déja un compte? Connectez-vous",
			errors: {
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
			tooltipPassword: 'Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un symbol'

		},
		us: {
			fileWarning: "Sorry, we only accept jpg, jpeg, png and max file size of 2mb",
			mailConfirmation: "A mail confirmation was send. Please active your account.",
			SignUp: 'Sign up',
			firstname: 'First name',
			lastname: 'Last name',
			email: 'Email Address',
			password: 'Password',
			password_confirm: 'Confirm password',
			username: 'Username',
			HaveAccount: "Already have an account? Sign in",
			errors: {
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
			tooltipPassword: 'Password must be at least 8 characters long contain number, lowercase, upppercase and symbol'
		}
	};
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
		username: ''
	})
	// Box
	const [defaultImg, setDefaultImg] = useState(defaultSrc);

	const handleRedirectLogin = (e) => {
		e.preventDefault();
		props.history.push('/login');
	};

	// Ref accessible by App.js
	useImperativeHandle(ref, () => ({
		setLanguageHandle(language) {
			setLanguage(language);
		}
	}));

	useEffect(() => {
		let mounted = true;		
			const cookies = new Cookies();
			if (cookies.get('token'))
				API.withAuth()
					.then(res => {
						if (res.status === 200){
							mounted && props.history.push('/');
						}
					})
					.catch((err) => mounted && cookies.remove('token'));
		return () => mounted = false;
	}, [props.history]);

	/* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
	const handleChange = (event) => {
		const { err_email, err_password, err_firstname, err_lastname, err_username, err_password_confirm } = validationErrors;
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
		setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });
	}
	// Signup
	const handleSignupClicked = async(e) => {
		e.preventDefault();
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
			errors.email = translate[language.language].errors.email;
		if (!VALIDATION.validateName(fieldValue.firstname))
			errors.firstname = translate[language.language].errors.firstname;
		if (!VALIDATION.validateName(fieldValue.lastname))
			errors.lastname = translate[language.language].errors.lastname;
		if (!fieldValue.password.length)
			errors.password = translate[language.language].errors.password_required
		else if (!VALIDATION.validatePassword(fieldValue.password))
			errors.password = translate[language.language].errors.password_strong
		if (fieldValue.password !== fieldValue.password_confirm)
			errors.password_confirm = translate[language.language].errors.password_confirm;
		if (!VALIDATION.validateUsername(fieldValue.username))
			errors.username = translate[language.language].errors.lastname;
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
			await API.register(fieldValue.firstname, fieldValue.lastname, fieldValue.email, fieldValue.username, fieldValue.password, fieldValue.password_confirm)
				.then(async(response) => {
					if (response.status === 200)
						await imagesFilesUpload(response.data.token);
					store.addNotification({
						message: translate[language.language].mailConfirmation,
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
					props.history.push('/login');
				})
				.catch(err => {
					if (err.response && err.response.data){
						setValidationErrors({
							...validationErrors,
							err_password: err.response.data.password ? translate[language.language].errors.password_strong : false,
							err_password_confirm: err.response.data.password ? translate[language.language].errors.password_strong : false,
							err_username: err.response.data.same_username ? translate[language.language].errors.usernameExist : false,
							err_email: err.response.data.same_email ? translate[language.language].errors.emailExist : false
						})
					}
				});
		}
	}

	/// HandleFacebookConnection
	const handleFacebookConnection = () => { API.facebookAuth() }
	// Handle42Connection
	const handle42Connection = () => { API.fortyTwoAuth() };

	const handleNotifFile = () => {
		store.addNotification({
			message: translate[language.language].fileWarning,
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

	const imagesFilesUpload = async(token) => {
		if (file) {
			const fileSize = Math.round((file.size / 1024));
			if ((fileSize >= 2048) || (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg'))
				handleNotifFile();
			else {
				const formData = new FormData();
				formData.append('file', file);
				await API.updatePicture(formData, token)
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

	const handleChangeImg = (e) => {
		if (e.target.files && e.target.files[0]){
			setFile(e.target.files[0]);
			setDefaultImg(URL.createObjectURL(e.target.files[0]));
		}
	}
	const handleCheckboxImg = () => {
		setDefaultImg(defaultSrc);
		setFile('');
	};



	return (
		<div className={classes.loginContainer}>
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
		{translate[language.language].SignUp}
		</Typography>
		<form className={classes.form} onSubmit={handleSignupClicked} noValidate>
		<Grid alignContent="center" justify={"center"} alignItems="center" container spacing={2}>
		<Grid className={classes.itemsPhotos} item xs={6} sm={6}>
		<div className={classes.imageUploadWrap}>
		<Fab variant="extended" size="small" className={classes.addPicture} >
		<AddIcon />
		{translate[language.language].addPicture}
		</Fab>
		<input
		className={classes.fileUploadInput}
		type="file"
		accept="image/png, image/jpg, image/jpeg"
		onChange={handleChangeImg}
		/>
		</div>
		<Fab onClick={handleCheckboxImg} variant="extended" size="small" className={classes.addPicture} >
		<ImageIcon />
		{translate[language.language].useDefault}
		</Fab>
		</Grid>
		<Grid item xs={6} sm={6}>
		<Avatar
		alt="Image"
		src={defaultImg}
		className={classes.large}
		/>
		</Grid>
		<Grid item xs={12} sm={6}>
		<TextField
		value={fieldValue.firstname || ''}
		onChange={handleChange}
		helperText={validationErrors.err_firstname}
		error={Boolean(validationErrors.err_firstname)}
		autoComplete="fname"
		name="firstname"
		variant="filled"
		required
		fullWidth
		id="firstname"
		label={translate[language.language].firstname}
		autoFocus
		className={classes.textfield}
		/>
		</Grid>
		<Grid item xs={12} sm={6}>
		<TextField
		value={fieldValue.lastname || ''}
		helperText={validationErrors.err_lastname}
		error={Boolean(validationErrors.err_lastname)}
		onChange={handleChange}
		variant="filled"
		required
		fullWidth
		id="lastname"
		label={translate[language.language].lastname}
		name="lastname"
		autoComplete="lname"
		className={classes.textfield}
		/>
		</Grid>
		<Grid item xs={12} sm={6}>
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
		autoComplete="email"
		className={classes.textfield}
		/>
		</Grid>
		<Grid item xs={12} sm={6}>
		<TextField
		value={fieldValue.username || ''}
		helperText={validationErrors.err_username}
		error={Boolean(validationErrors.err_username)}
		onChange={handleChange}
		variant="filled"
		required
		fullWidth
		id="username"
		name="username"
		label={translate[language.language].username}
		autoComplete="username"
		className={classes.textfield}
		/>
		</Grid>
		<Grid item xs={12} sm={6}>
		<Tooltip title={translate[language.language].tooltipPassword} placement={'left'} arrow>
		<TextField
		value={fieldValue.password || ''}
		helperText={validationErrors.err_password}
		error={Boolean(validationErrors.err_password)}
		onChange={handleChange}
		variant="filled"
		required
		fullWidth
		name="password"
		label={translate[language.language].password}
		type="password"
		id="password"
		autoComplete="current-password"
		className={classes.textfield}
		/>
		</Tooltip>
		</Grid>
		<Grid item xs={12} sm={6}>
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
		variant="contained"
		color="primary"
		type="submit"
		className={classes.signupButton}
		onClick={handleSignupClicked}
		>
		{translate[language.language].SignUp}
		</Button>
		<ButtonGroup
		fullWidth
		size="large"
		variant="contained"
		aria-label="contained primary button group"
		className={classes.buttonGroup}>
		<Button
		onClick={handle42Connection}
		startIcon={<IcomoonReact iconSet={iconSet} color="#ffff" size={22} icon="42" />}
		className={classes.button42}>
		Auth
		</Button>
		<Button
		onClick={handleFacebookConnection}
		startIcon={<FacebookIcon />}
		className={classes.buttonFacebook}>
		Facebook
		</Button>
		</ButtonGroup>
		<Grid container justify="flex-end">
		<Grid item>
		<Link onClick={handleRedirectLogin} href="#" variant="body2">
		{translate[language.language].HaveAccount}
		</Link>
		</Grid>
		</Grid>
		</form>
		</div>
		</Container>
		</Grow>
		</div>)
}));
export default Signup;
