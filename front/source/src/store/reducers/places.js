import * as actionTypes from '../actions/actionTypes';

const initialState = {
    places: [],
};

const reducer = (state = initialState, action) => {

    switch (action.type) {

        case (actionTypes.ADD_SOCKET_LIST):
            console.log(action)

            let newArrayPlacesList = state.places.filter((place) => (place.ID !== action.id));
            let placeList = state.places.find(place => place.ID === action.id);
            console.log("PLACE LIST")
            console.log(placeList)

            console.log(state.places.find(obj => action.id === obj.ID))
            
            placeList.activeStaff = action.users;
            newArrayPlacesList = newArrayPlacesList.concat(placeList);
            
            return {
                ...state,
                places: newArrayPlacesList,
            };
        case (actionTypes.ADD_SOCKET_PEOPLE):
            console.log(action)
            let newArrayPlaces = state.places.filter((place) => (place.ID !== action.id));
            let place = state.places.find(place => place.ID === action.id);
            place = { ...place, people: action.numUsers };
            newArrayPlaces = newArrayPlaces.concat(place);
            return {
                ...state,
                places: newArrayPlaces,
            };

            ////////////

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
        default:
            return state;
    }
}

export default reducer;