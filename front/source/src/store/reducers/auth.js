import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: null,
    token: null,
    isAdmin: false,
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case (actionTypes.AUTH_SUCCESS):
            let isAdminVal = null;
            if (typeof action.isAdmin === 'string') {
                isAdminVal = (action.isAdmin === "true")
            } else {
                isAdminVal = action.isAdmin
            }
            return {
                ...state,
                token: action.token,
                username: action.username,
                isAdmin: isAdminVal,
            };
        case (actionTypes.AUTH_LOGOUT):
            return {
                ...state,
                token: null,
                username: null,
                isAdmin: false,
            };
        case (actionTypes.REFRESH_TOKEN):
            return {
                ...state,
                token: action.token,
            };
        default:
            return state;
    }
}

export default reducer;