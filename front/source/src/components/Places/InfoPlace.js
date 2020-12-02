import React, { useEffect, useState } from 'react';
import EditPlace from './EditPlace';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Place from './Place';
import * as actions from '../../store/actions/index';
import socketIOClient from "socket.io-client";
import * as api from "../../store/actions/api";


const InfoPlace = props => {
    const socket = props.socket

    const [people, setPeople] = useState(props.place.people)
    const id = props.place.ID;
    console.log(props.place)

    socket.emit("change-place", props.place.name);

    socket.on("update-place", (data) => {
        console.log(data)
        setPeople(data);
        props.places[id - 1].people = data;
    });


    function addPersonHandler() {
        socket.emit("change-place", props.place.name);
        socket.emit("add-people", "")
    }

    function subPersonHandler() {
        socket.emit("change-place", props.place.name);
        socket.emit("sub-people", "")
    }

    let adminInfoPlaces = (
        <div>
            <EditPlace place={props.place} updatePlace={props.updatePlace} />
            <hr />
            <Button variant="danger" onClick={(event) => props.deletePlace(event, props.place.ID)}>Delete Place</Button>
            <hr />
        </div>
    );

    return (
        <div style={{ padding: '10px' }}>
            {props.isAdmin === true ? adminInfoPlaces : null}
            <div style={{ padding: '10px' }}>
                <button onClick={() => addPersonHandler()}> + </button>
                <div>{people}</div>
                <button onClick={() => subPersonHandler()}> - </button>
            </div>
            <hr />
            <div>
                <h3>Users online</h3>
                <ul>
                    <li>user 1</li>
                    <li>user 2</li>
                    <li>user 3</li>
                </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoPlace);