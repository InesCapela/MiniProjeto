import React, { useState } from 'react';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { useStyles } from '../Styles/Styles';
import * as actions from '../../store/actions/index';


const CreateUser = props => {

    // styles
    const classes = useStyles();

    // state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.createUser(username, password, props.token);
    }

    return (
        <Container maxWidth="sm" >
            <form onSubmit={onSubmitHandler} className={classes.authTextFileds} noValidate autoComplete="off">
                <h2>Create User</h2>
                <div>
                    <TextField required id="standard-basic" label="Username" onChange={event => {
                        setUsername(event.target.value);
                    }} />
                </div>
                <div>
                    <TextField required id="standard-password-input" label="Password" type="password" onChange={event => {
                        setPassword(event.target.value);
                    }} />
                </div>
                <div>
                    <Button type="submit" variant="contained" color="primary">Create User</Button>
                </div>
            </form>
        </Container >
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (username, password, token) => dispatch(actions.createUser(username, password, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);