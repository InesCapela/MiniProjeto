import React from 'react';

import Button from 'react-bootstrap/Button';

const User = props => {

    return (
        <tr>
            <td>{props.id}</td>
            <td>{props.username}</td>
            <td><Button variant="danger" onClick={() => props.deleteUser(props.id)} disabled={props.username === 'admin'} >Delete</Button></td>
            <td><Button variant="info" onClick={() =>
                props.userSelected({ username: props.username, password: props.password })}>Edit</Button></td>
        </tr>
    );
}

export default User;