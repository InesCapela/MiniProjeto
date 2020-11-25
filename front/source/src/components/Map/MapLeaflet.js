import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Markerpop from './Markerpop';
import Markeradd from './Markeradd';
import 'leaflet/dist/leaflet.css';


const MapLeaflet = props => {

    const places = [
        { name: 'NorteShopping', lat: 41.190541, long: -8.665491 },
        { name: 'MarShopping', lat: 41.170541, long: -8.665491 },
        { name: 'ArrabidaShopping', lat: 41.200541, long: -8.665491 },
        { name: 'MaiaShopping', lat: 41.190541, long: -8.675491 },
    ]

    const placesl = places.map(place => {
        return <Markerpop key={Math.random()} name={place.name} lat={place.lat} long={place.long} />
    });

    let isAuth = !props.token ? <Redirect to='/' /> : null;

    return (
        <Container maxWidth="lg">
            {isAuth}
            <MapContainer style={{ height: '700px' }} center={[41.1496100, -8.6109900]} zoom={13}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {placesl}
                <Markeradd />
            </MapContainer>
        </Container>
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
    };
}

export default connect(mapStateToProps, null)(MapLeaflet);
