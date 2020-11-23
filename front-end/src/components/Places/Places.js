import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { Redirect } from 'react-router';

import Place from './Place';
import * as placesActions from '../../store/actions/index';

import HomeIcon from '@material-ui/icons/Home';
import { DialogContentText, DialogContent, CircularProgress, List } from '@material-ui/core';
import BackdropUI from '../UI/Backdrop/BackdropUI';

import { useStyles } from '../Styles/Styles';

const Places = props => {

    // styles
    const classes = useStyles();

    //dependecy
    const { onGetAllPlaces } = props;

    useEffect(() => {
        if (props.token !== null) {
            onGetAllPlaces(props.token);
        }
    }, [onGetAllPlaces, props.history, props.token])

    let places = <CircularProgress />

    if (!props.loading) {
        places = props.places.map(place => {
            return <Place
                key={place.ID}
                id={place.ID}
                name={place.name}
                persons={place.people}
            />
        });
    }

    if (places.length === 0) {
        places = (<h3>Not found!</h3>);
    }

    if (props.error) {
        places = (
            <BackdropUI>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.error}
                    </DialogContentText>
                </DialogContent>
            </BackdropUI>
        );
    }


    // is authenticated
    let placesEl = !props.token ? <Redirect to='/' /> : null;

    return (
        <div>
            {placesEl}
            <div className={classes.places}>
                <h1>Places <HomeIcon /></h1>
                <div>
                    <List>
                        {places}
                    </List>
                </div>
            </div>
        </div>
    );

}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        places: state.places.places,
        loading: state.loadingError.loading,
        error: state.loadingError.error,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllPlaces: (token) => dispatch(placesActions.fetchAllPlaces(token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Places);