import axios from 'axios';

import * as loadingErrorActions from '../actions/index';
import * as actionTypes from './actionTypes';
import * as api from '../actions/api';

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
        axios.get(api.URL_GET_ALL_USERS, auth).then(response => {
            dispatch(getAllUsers(response.data.data));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            console.log(err)
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

        axios.post(api.URL_USERS_ADD, newUser, auth).then(res => {
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

        axios.delete(api.URL_USERS_DELETE + id, auth).then(res => {
            dispatch(onDeleteUser(id));
        }).catch(err => {
            console.log(err);
        });
    }
}

const onUpdateUser = (user) => {
    return {
        type: actionTypes.EDIT_USER,
        user: user,
    }
}

export const editUser = (user, token) => {
    return (dispatch) => {
        const auth = {
            headers: {
                Authorization: token,
            }
        };
        const updatedUser = {
            username: user.username,
            password: user.password
        };
        axios.put(api.URL_USERS_EDIT + user.id, updatedUser, auth).then(res => {
            dispatch(onUpdateUser(user));
        }).catch(err => {
            console.log(err);
        });
    }
}

const onGetUserPlacesByAdmin = (userPlaces) => {
    return {
        type: actionTypes.GET_USER_PLACES_ADMIN,
        userPlaces: userPlaces,
    }
}

export const getUserPlacesByAdmin = (id, token) => {
    return (dispatch) => {
        dispatch(loadingErrorActions.startRequest());
        const auth = {
            headers: {
                Authorization: token,
            }
        };

        axios.get(api.URL_USERS_PLACES_ADMIN + id, auth).then(res => {
            dispatch(onGetUserPlacesByAdmin(res.data.data));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            console.log(err);
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}

const onAddPlaceToUserHandler = (place) => {
    return {
        type: actionTypes.ADD_PLACE_TO_USER,
        place: place,
    }
}

export const addPlaceToUserHandler = (user, place, token) => {
    return (dispatch) => {
        const auth = {
            headers: {
                Authorization: token,
            }
        };
        const userToOp = {
            user_id: user.id,
        }

        axios.post(api.URL_ADD_PLACE_TO_USER + place.ID, userToOp, auth).then(res => {
            dispatch(onAddPlaceToUserHandler(place));
        }).catch(err => {
            console.log(err);
        });
    }
}

//TODO
const onRemovePlaceToUserHandler = (id) => {
    return {
        type: actionTypes.REMOVE_PLACE_FROM_USER,
        id: id,
    }
}

export const removePlaceToUserHandler = (user, place, token) => {
    return (dispatch) => {
        const authAndData = {
            headers: {
                Authorization: token,
            },
            data: {
                user_id: user.id,
            }
        };

        axios.delete(api.URL_REMOVE_PLACE_FROM_USER + place.ID, authAndData).then(res => {
            console.log(res.data.data)
            dispatch(onRemovePlaceToUserHandler(place.ID));
        }).catch(err => {
            console.log(err);
        });
    }
}