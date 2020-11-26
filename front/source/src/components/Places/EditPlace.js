import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { useStyles } from '../Styles/Styles';

const EditPlace = props => {

    // styles
    const classes = useStyles();

    // state
    const [placeName, setName] = useState('');
    const [placeLatitude, setLatitude] = useState('');
    const [placeLongitude, setLongitude] = useState('');

    const { name, latitude, longitude } = props.place;

    useEffect(() => {
        setName(name);
        setLatitude(latitude);
        setLongitude(longitude);
    }, [name, latitude, longitude]);

    const updatedPlace = {
        ...props.place,
        name: placeName,
        latitude: placeLatitude,
        longitude: placeLongitude,
    }

    return (
        <Container maxWidth="sm" >
            <form onSubmit={(event) => props.updatePlace(event, updatedPlace)} className={classes.authTextFileds} noValidate autoComplete="off">
                <div>
                    <TextField value={placeName} required id="standard-basic" label="Name" onChange={event => {
                        setName(event.target.value);
                    }} />
                </div>
                <div>
                    <TextField disabled value={placeLatitude} required id="standard-basic" label="Latitude" onChange={event => {
                        setLatitude(event.target.value);
                    }} />
                </div>
                <div>
                    <TextField disabled value={placeLongitude} required id="standard-basic" label="Longitude" onChange={event => {
                        setLongitude(event.target.value);
                    }} />
                </div>
                <div>
                    <Button type="submit" variant="contained" color="primary">Edit Place</Button>
                </div>
            </form>
        </Container >
    );
}

export default EditPlace;