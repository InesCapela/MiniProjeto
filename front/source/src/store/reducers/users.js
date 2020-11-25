import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: [],
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case (actionTypes.GET_ALL_USERS):
            return {
                ...state,
                users: action.users,
            };
        case (actionTypes.CREATE_USER):
            const newUser = {
                ID: action.id,
                username: action.username,
            }
            return {
                ...state,
                users: state.users.concat(newUser),
            };
        case (actionTypes.EDIT_USER):
            return {
                ...state,
                // users: action.users,
            };
        case (actionTypes.DELETE_USER):
            return {
                ...state,
                users: state.users.filter((user) => (user.id !== action.id)),
            };
        default:
            return state;
    }
}

export default reducer;