import React, { useMemo, useRef, useState, useEffect } from 'react';

import iconImg from '../../images/marker_add.png';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useStyles } from '../Styles/Styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const addIcon = L.icon({
    iconUrl: iconImg,
    iconSize: [25.75, 38.7],
    popupAnchor: [0, -20],
});

const Markeradd = (props) => {

    // styles
    const classes = useStyles();

    const markerRef = useRef(null);

    const [latlng, setlatlng] = useState('');

    const [center, setCenter] = useState([41.2707, -8.5824]);

    const [name, setName] = useState('');

    useEffect(() => {
        if (latlng === '') {
            setlatlng({ lat: center[0], lng: center[1] });
        }
    }, [center, latlng])

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setlatlng({ lat: marker.getLatLng().lat, lng: marker.getLatLng().lng });
                    setCenter([marker.getLatLng().lat, marker.getLatLng().lng]);
                } else
                    console.log(marker);
            },
        }),
        [])

    return (
        <Marker
            ref={markerRef}
            draggable={true}
            position={center}
            icon={addIcon}
            opacity={props.opacity}
            zIndexOffset={1000}
            eventHandlers={eventHandlers}>
            <Popup minWidth={90}>
                <form onSubmit={(event) => props.addPlace(event, { name: name, latitude: latlng.lat, longitude: latlng.lng })}
                    className={classes.authTextFileds}
                    noValidate
                    autoComplete="off">
                    <div>
                        <strong><label>Latitude:</label></strong>{latlng.lat}
                        <br />
                        <strong><label>Longitude:</label></strong>{latlng.lng}
                        <TextField required id="standard-basic" label="Name" onChange={event => {
                            setName(event.target.value);
                        }} />
                        <Button type="submit" variant="contained" color="primary">Create Place</Button>
                    </div>
                </form>
            </Popup>
        </Marker>
    );
}

export default Markeradd;