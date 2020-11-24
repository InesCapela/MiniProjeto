import axios from 'axios';

import * as loadingErrorActions from '../actions/index';
import * as actionTypes from './actionTypes';

const getAllUsers = (users) => {
    return {
        type: actionTypes.GET_ALL_USERS,
        users: users,
    }
}

export const fetchAllUsers = (token) => {
    return (dispatch) => {
        dispatch(loadingErrorActions.startRequest());
        const auth = {
            headers: {
                Authorization: token
            }
        };
        axios.get('http://0.0.0.0:8081/api/v1/back/users', auth).then(response => {
            dispatch(getAllUsers(response.data.data));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}

const createNewUser = (username, id) => {
    return {
        type: actionTypes.CREATE_USER,
        username: username,
        id: id,
    }
}

export const createUser = (username, password, token) => {
    return (dispatch) => {
        const newUser = {
            username: username,
            password: password
        };

        const auth = {
            headers: {
                Authorization: token,
            }
        };

        axios.post('http://0.0.0.0:8081/api/v1/auth/register', newUser, auth).then(res => {
            dispatch(createNewUser(username, res.data.userID));
        }).catch(err => {
            console.log(err);
        });
    }
}

const onDeleteUser = (id) => {
    return {
        type: actionTypes.DELETE_USER,
        id: id,
    }
}

export const deleteUser = (id, token) => {
    return (dispatch) => {
        const auth = {
            headers: {
                Authorization: token,
            }
        };

        axios.delete('http://0.0.0.0:8081/api/v1/back/users/' + id, auth).then(res => {
            dispatch(onDeleteUser(id));
        }).catch(err => {
            console.log(err);
        });
    }
}

const onUpdateUser = () => {
    return {
        type: actionTypes.DELETE_USER,

    }
}

export const editUser = (token) => {
    return (dispatch) => {
        const auth = {
            headers: {
                Authorization: token,
            }
        };

    }
}
