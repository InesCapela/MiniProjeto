import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as loadingErrorActions from '../actions/index';
import * as api from '../actions/api';

export const authSuccess = (token, username, isAdmin) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username,
        isAdmin: isAdmin,
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('isAdmin');
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
}

export const auth = (username, password) => {
    return dispatch => {
        const authData = {
            username: username,
            password: password
        };

        dispatch(loadingErrorActions.startRequest());

        axios.post(api.URL_LOGIN, authData).then(res => {

            const expirationDate = new Date(Date.parse(res.data.expirationTime));
            // 60000 -> 1min to refresh token before it expires
            const expirationTime = Date.parse(res.data.expirationTime) - new Date().getTime() - 60000;

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('expirationTime', expirationTime);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('isAdmin', res.data.isAdmin);

            dispatch(checkAuthTimeout(expirationTime));
            dispatch(authSuccess(res.data.token, res.data.username, res.data.isAdmin));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            // not working -> after token expiration date the user are redirect to login page
            // refreshToken();
            dispatch(logout());
        }, expirationTime);
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const username = localStorage.getItem('username');
            const isAdmin = localStorage.getItem('isAdmin');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                // 60000 -> 1min to refresh token before it expires
                const expirationTime = expirationDate.getTime() - new Date().getTime() - 60000;
                dispatch(authSuccess(token, username, isAdmin));
                dispatch(checkAuthTimeout(expirationTime));
            }
        }
    };
}

/* const refreshToken = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        const auth = {
            headers: {
                username: username,
                Authorization: token,
            }
        };

        axios.put('http://0.0.0.0:8081/api/v1/auth/refresh_token', null, auth).then(res => {

            const expirationDate = new Date(Date.parse(res.data.expirationTime));
            // 60000 -> 1min to refresh token before it expires
            const expirationTime = Date.parse(res.data.expirationTime) - new Date().getTime() - 60000;

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('expirationTime', expirationTime);
            localStorage.setItem('isAdmin', res.data.isAdmin);

            dispatch(authSuccess(res.data.token, res.data.isAdmin));
            dispatch(checkAuthTimeout(expirationTime));
        }).catch(err => {
            dispatch(logout());
        });
    }
} */