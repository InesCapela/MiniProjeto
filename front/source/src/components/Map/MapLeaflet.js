import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Markerpop from './Markerpop';
import Markeradd from './Markeradd';
import 'leaflet/dist/leaflet.css';
import * as actions from '../../store/actions/index';

const MapLeaflet = props => {

    const [opacity, setOpacity] = useState(0);

    const placesl = props.places.map(place => {
        return <Markerpop
            key={place.ID}
            id={place.ID}
            name={place.name}
            lat={place.latitude}
            long={place.longitude}
            people={place.people}
        />
    });

    let isAuth = !props.token ? <Redirect to='/' /> : null;

    const onAddPlaceHandler = (event, place) => {
        event.preventDefault();
        // create place
        props.onAddPlace(place, props.token);
    }

    const opacityHandler = () => {
        setOpacity(opacity === 0 ? 1 : 0);
    }

    return (
        <Container maxWidth="lg">
            {isAuth}
            {props.isAdmin === true ?
                <Button onClick={opacityHandler} variant="contained" color="primary">{opacity === 1 ? 'Hide add marker' : 'Show add marker'}</Button>
                : null
            }
            <MapContainer style={{ height: '700px' }} center={[41.1496100, -8.6109900]} zoom={13}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {placesl}
                {props.token && props.isAdmin && opacity === 1 ? <Markeradd addPlace={onAddPlaceHandler} opacity={opacity} /> : null}
            </MapContainer>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        places: state.places.places,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddPlace: (place, token) => dispatch(actions.createPlace(place, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapLeaflet);
