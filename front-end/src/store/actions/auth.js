import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as loadingErrorActions from '../actions/index';

export const authSuccess = (token, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username,
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path,
    };
}

export const refreshToken = (token) => {
    return {
        token: token,
    };
}

export const auth = (username, password) => {
    return dispatch => {
        const authData = {
            username: username,
            password: password
        };

        axios.post('http://0.0.0.0:8081/api/v1/auth/login', authData).then(res => {
            dispatch(loadingErrorActions.startRequest());

            const expirationDate = new Date(Date.parse(res.data.expirationTime));

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('username', res.data.username);

            const expirationTime = Date.parse(res.data.expirationTime) - new Date().getTime();

            dispatch(checkAuthTimeout(expirationTime));
            dispatch(authSuccess(res.data.token));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
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
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                const username = localStorage.getItem('username');
                const auth = {
                    headers: {
                        Authorization: token,
                        username: username,
                    }
                };
                axios.put('http://0.0.0.0:8081/api/v1/auth/refresh_token', auth).then(res => {
                    dispatch(refreshToken(res.data.data));
                }).catch(err => {
                    dispatch(logout());
                });
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())));
            }
        }
    };
}