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
        case (actionTypes.GET_USER_PLACES):
            return {
                ...state,
                places: action.places,
            };
        case (actionTypes.CREATE_PLACE):
            const newPlace = {
                ...action.place,
                ID: action.id,
                people: 0,
            }
            return {
                ...state,
                places: state.places.concat(newPlace),
            };
        case (actionTypes.EDIT_PLACE):
            let placearray = state.places.filter((place) => (place.ID !== action.place.ID));
            let newarray = placearray.concat(action.place);
            return {
                ...state,
                places: newarray,
            };
        case (actionTypes.DELETE_PLACE):
            return {
                ...state,
                places: state.places.filter((place) => (place.ID !== action.id)),
            };
        case (actionTypes.ADD_SOCKET_LIST):
            console.log(action)
            return {
                ...state,
            };
        case (actionTypes.ADD_SOCKET_PEOPLE):
            console.log(action)
            return {
                ...state,
            };
        default:
            return state;
    }
}

export default reducer;