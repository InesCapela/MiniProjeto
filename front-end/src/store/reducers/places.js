import * as actionTypes from '../actions/actionTypes';

const initialState = {
    places: [],
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case (actionTypes.GET_ALL_PLACES):
            return {
                ...state,
                places: action.places,
            };
        default:
            return state;
    }
}

export default reducer;