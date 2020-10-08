import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
				Sawgrass Nutralabs
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
};

const SignUp = ({ history }) => {
	const handleSignUp = useCallback(
		async (event) => {
			event.preventDefault();
			const { email, password } = event.target.elements;
			try {
				history.push('/');
			} catch (error) {
				alert(error);
			}
		},
		[history]
	);

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create User
				</Typography>
				<form className={classes.form} onSubmit={handleSignUp}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Create User
					</Button>
					<Button fullWidth variant="contained" color="primary">
						<NavLink
							to="/"
							style={{
								textDecoration: 'none',
								color: 'white',
							}}
						>
							Cancel
						</NavLink>
					</Button>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
};

export default withRouter(SignUp);
