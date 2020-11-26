import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import CreateUser from './CreateUser';
import Table from 'react-bootstrap/Table';
import * as actions from '../../store/actions/index';
import User from './User';
import EditUser from './EditUser';

const Users = props => {

    const [selectUser, setSelectUser] = useState(null);

    const { onGetAllUsers, onDeleteUser, onUpdateUser } = props;

    useEffect(() => {
        if (props.token !== null) {
            if (props.isAdmin) {
                onGetAllUsers(props.token);
            }
        }
    }, [onGetAllUsers, props.token, props.isAdmin]);

    const selectedUserHandler = (user) => {
        setSelectUser(user);
    }

    const deleteUserHandler = (id) => {
        onDeleteUser(id, props.token);
    }

    const updateUserHandler = (event, user) => {
        event.preventDefault();
        onUpdateUser(user, props.token);
    }

    let users = props.users.map(user => {
        return <User
            key={user.ID}
            id={user.ID}
            username={user.username}
            password={user.password}
            isAdmin={user.isAdmin}
            places={user.places}
            userSelected={selectedUserHandler}
            deleteUser={deleteUserHandler}
        />
    });

    let isAuth = !props.token || !props.isAdmin ? <Redirect to='/' /> : null;

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
                    {selectUser ? <EditUser
                        user={selectUser}
                        updateUser={updateUserHandler}
                        token={props.token}
                        usrPlaces={props.places} /> : null}
                </div>
            </div>
        </React.Fragment>
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        users: state.users.users,
        places: state.places.places,
    };
}

// actions to reducer (dispatch)
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllUsers: (token) => dispatch(actions.fetchAllUsers(token)),
        onDeleteUser: (id, token) => dispatch(actions.deleteUser(id, token)),
        onUpdateUser: (user, token) => dispatch(actions.editUser(user, token)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);