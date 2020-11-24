import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import CreateUser from './CreateUser';
import Table from 'react-bootstrap/Table';
import * as actions from '../../store/actions/index';
import User from './User';
import EditUser from './EditUser';
import { useState } from 'react';

const Users = props => {

    const [selectUser, setSelectUser] = useState('');

    const { onGetAllUsers, onDeleteUser } = props;

    useEffect(() => {
        if (props.token !== null) {
            onGetAllUsers(props.token);
        }
    }, [onGetAllUsers, onDeleteUser, props.token]);

    const selectedUserHandler = (user) => {
        setSelectUser(user);
    }

    const deleteUserHandler = (id) => {
        onDeleteUser(id, props.token);
    }

    let users = props.users.map(user => {
        return <User
            key={user.ID}
            id={user.ID}
            username={user.username}
            password={user.password}
            userSelected={selectedUserHandler}
            deleteUser={deleteUserHandler}
        />
    });

    let isAuth = !props.token ? <Redirect to='/' /> : null;

    return (
        <React.Fragment>
            {isAuth}
            <div>
                <CreateUser />
            </div>
            <hr />
            <div>
                <h3>Users</h3>
                <div style={{ margin: 'auto', width: '50%', display: 'flex' }}>
                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Delete</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users}
                        </tbody>
                    </Table>
                    {selectUser ? <EditUser user={selectUser} token={props.token} /> : null}
                </div>
            </div>
        </React.Fragment>
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        users: state.users.users,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllUsers: (token) => dispatch(actions.fetchAllUsers(token)),
        onDeleteUser: (id, token) => dispatch(actions.deleteUser(id, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);