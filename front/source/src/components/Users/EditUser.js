import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { useStyles } from '../Styles/Styles';

const EditUser = props => {

    // styles
    const classes = useStyles();

    // state
    const [name, setUsername] = useState('');
    const [pass, setPassword] = useState('');

    const { username, password } = props.user;

    useEffect(() => {
        setUsername(username);
        setPassword(password);
    }, [username, password]);

    let userPlaces = props.usrPlaces.map(usrplace => {
        return (
            <div key={Math.random()} >
                <li>
                    {usrplace.name}
                    <button> + </button>
                    <button> - </button>
                </li>
            </div>
        )
    })

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
                    <Button type="submit" variant="contained" color="primary">Edit User</Button>
                </div>
            </form>
            <hr />
            <div style={{ padding: '10px' }}>
                <h3>User places</h3>
                <ul>
                    {userPlaces}
                </ul>
            </div>
        </Container >
    );
}

export default EditUser;