import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import * as placesActions from '../../store/actions/index';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BackdropUI from '../UI/Backdrop/BackdropUI';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useStyles } from '../Styles/Styles';
import { FormControl } from '@material-ui/core';

const PlaceView = props => {

	let placeId = props.id;

    // is authenticated
    let redirect = !props.token ? <Redirect to='/' /> : null;

    return (
		<div>
			<Container maxWidth="bg" >

				<a href="/">Voltar atrás</a>
				<h1>Place #1</h1><hr></hr>
				<form>
					<div>
						<Button type="submit" variant="contained" color="primary"><bold>+</bold></Button>
					</div>
				</form>
				<h1><bold> 50 person (s)</bold></h1>
				<form>
					<div>
						<Button type="submit" variant="contained" color="primary"><bold>-</bold></Button>
					</div>
				</form>

				<hr></hr>
				<h1>Staff Online</h1>
				<br></br>- John
				<br></br>- Pedro


			</Container >

        </div>
    );

}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        loading: state.loadingError.loading,
        error: state.loadingError.error,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceView);