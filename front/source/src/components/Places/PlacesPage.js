import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Places from './Places';
import * as actions from '../../store/actions/index';
import * as api from '../../store/actions/api';
import socketIOClient from "socket.io-client";


const PlacesPage = props => {

    const socket = socketIOClient(api.URL_SOCKETIO, {
        extraHeaders: {
            "token": props.token
        }
    });

    socket.on("connect", (data) => {
        console.log("Socket.io Connected ...")

        socket.on("update-place", (data) => {
            console.log("NEW UPDATE: ");
            console.log(data);
    
        });
    })

    socket.on("disconnect", (data) => {
        console.log("Socket.io Disconnected ...")
    })

    return (
        <div>
            <Places socket={socket}></Places>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlacesPage);