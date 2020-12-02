import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { useStyles } from '../Styles/Styles';
import { CircularProgress } from '@material-ui/core';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const EditUser = props => {

    // styles
    const classes = useStyles();

    // state
    const [name, setUsername] = useState('');
    const [pass, setPassword] = useState('');

    const { username, password, id } = props.user;
    const { token, onGetUserPlacesAdmin } = props;

    useEffect(() => {
        onGetUserPlacesAdmin(id, token);
        setUsername(username);
        setPassword(password);
    }, [username, password, id, token, onGetUserPlacesAdmin]);

    const addPlaceToUserHandler = (place) => {
        props.onAddPlaceToUserHandler(props.user, place, token);
    }

    const removePlaceFromUserHandler = (place) => {
        props.onRemovePlaceFromUserHandler(props.user, place, token);
    }

    let usrPlaces = <CircularProgress />
    let otherPlaces = <CircularProgress />

    if (!props.loading && props.user.username !== 'admin') {
        usrPlaces = props.usrPlaces.map((place) => {
            return (
                <tr key={place.ID}>
                    <td key={place.ID}>{place.name}</td>
                    <td><Button onClick={() => removePlaceFromUserHandler(place)} variant="danger">Remove</Button></td>
                </tr>
            )
        });

        // filter places that user dont have
        const otherplacesarray = props.allPlaces.filter((placesAll) => {
            return !props.usrPlaces.find((placesUser) => {
                return placesAll.ID === placesUser.ID
            })
        });

        otherPlaces = otherplacesarray.map((place) => {
            return (
                <tr key={place.ID}>
                    <td key={place.ID}>{place.name}</td>
                    <td><Button onClick={() => addPlaceToUserHandler(place)} variant="success">Add</Button></td>
                </tr>
            )
        });
    }

    return (
        <Container maxWidth="sm" >
            <form onSubmit={(event) => props.updateUser(event, { id: props.user.id, username: name, password: pass, isAdmin: props.user.isAdmin, places: props.user.places })} className={classes.authTextFileds} noValidate autoComplete="off">
                <div>
                    <TextField value={name} required id="standard-basic" label="Username" onChange={event => {
                        setUsername(event.target.value);
                    }} />
                </div>
                <div>
                    <TextField value={pass} required id="standard-password-input" label="Password" type="password" onChange={event => {
                        setPassword(event.target.value);
                    }} />
                </div>
                <div>
                    <Button disabled={name === username && pass === password} type="submit" variant="primary">Edit User</Button>
                </div>
            </form>
            <hr />
            {props.user.username !== 'admin' ?
                <React.Fragment>
                    <h3>Manage User Places</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usrPlaces}
                            {otherPlaces}
                        </tbody>
                    </Table>
                </React.Fragment>
                : null}

        </Container >
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        usrPlaces: state.users.userPlaces,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        onGetUserPlacesAdmin: (id, token) => dispatch(actions.getUserPlacesByAdmin(id, token)),
        onAddPlaceToUserHandler: (user, place, token) => dispatch(actions.addPlaceToUserHandler(user, place, token)),
        onRemovePlaceFromUserHandler: (user, place, token) => dispatch(actions.removePlaceToUserHandler(user, place, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
