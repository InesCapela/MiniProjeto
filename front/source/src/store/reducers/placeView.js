import * as actionTypes from '../actions/actionTypes';

const initialState = {
    placeID: 0,
    people: 0,
};

const placeViewReducer = (state = initialState, action) => {

    switch (action.type) {

        case (actionTypes.PLACE_ADD):
            return {
                ...state,
                loading: true,
                error: null,
            };
		
		case (actionTypes.PLACE_ADD):
            return {
                ...state,
                loading: false,
                error: null,
            };
		
		default:
            return state;
    }
}

export default placeViewReducer;