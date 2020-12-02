import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Place from './Place';
import * as actions from '../../store/actions/index';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import { CircularProgress } from '@material-ui/core';
import { useStyles } from '../Styles/Styles';
import InfoPlace from './InfoPlace';

const Places = props => {

    const socket = props.socket;

    const [selectedPlace, setSelectedPlace] = useState(null);

    // styles
    const classes = useStyles();

    //dependecy
    const { onGetAllPlaces, onGetUserPlaces } = props;

    useEffect(() => {
        if (props.token !== null) {
            if (props.isAdmin) {
                onGetAllPlaces(props.token);
            } else {
                onGetUserPlaces(props.token)
            }
        }
    }, [onGetAllPlaces, onGetUserPlaces, props.token, props.isAdmin])


    let places = <CircularProgress />

    const selectedPlaceHandler = (event, place) => {
        event.preventDefault();
        socket.emit("change-place", place.name);
        setSelectedPlace(place, socket);
    }

    // update place
    const updatePlaceHandler = (event, place) => {
        event.preventDefault();
        props.onUpdatePlace(place, props.token);
    }

    // delete place
    const deletePlaceHandler = (event, id) => {
        event.preventDefault();
        props.onDeletePlace(id, props.token);
        setSelectedPlace(null);
    }

    const addPersonHandler = (event) => {
        event.preventDefault();
        socket.emit("add-people", "")
    }

    const subPersonHandler = (event) => {
        event.preventDefault();
        socket.emit("sub-people", "")
    }

    if (!props.loading) {
        places = props.places.map(place => {
            return <Place
                key={place.ID}
                id={place.ID}
                name={place.name}
                lat={place.latitude}
                lng={place.longitude}
                persons={place.people}
                selectPlace={selectedPlaceHandler}
            />
        });
    }

    if (places.length === 0) {
        places = (<h3>Not found!</h3>);
    }

    let isAuth = !props.token ? <Redirect to='/' /> : null;

    return (
        <div>
            {isAuth}
            <div className={classes.places}>
                <h1>Places <HomeIcon /></h1>
                <div style={{ display: 'flex', width: '100%' }}>
                    <List>
                        {places}
                    </List>

                    {selectedPlace && places.length !== 0 ? <InfoPlace
                        isAdmin={props.isAdmin}
                        place={selectedPlace}
                        socket={socket}
                        updatePlace={updatePlaceHandler}
                        deletePlace={deletePlaceHandler}
                        addPersonHandler={addPersonHandler}
                        subPersonHandler={subPersonHandler} /> : null}
                </div>
            </div>
        </div>
    );

}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        places: state.places.places,
        loading: state.loadingError.loading,
        error: state.loadingError.error,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllPlaces: (token) => dispatch(actions.fetchAllPlaces(token)),
        onGetUserPlaces: (token) => dispatch(actions.fetchUserPlaces(token)),
        onUpdatePlace: (place, token) => dispatch(actions.editPlace(place, token)),
        onDeletePlace: (id, token) => dispatch(actions.deletePlace(id, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Places);