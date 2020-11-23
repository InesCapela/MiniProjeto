import axios from 'axios';

import * as loadingErrorActions from '../actions/index';
import * as actionTypes from './actionTypes';


const getPlaceInfo = (placeID) => {
    return {
        type: actionTypes.GET_PLACE_INFO,
        placeID: placeID
    }
}

const fetchPlaceInfo = (token) => {
    return (dispatch) => {
        dispatch(loadingErrorActions.startRequest());
        const auth = {
            headers: {
                Authorization: "Bearer " + token
            }
        };
        axios.get('http://0.0.0.0:8081/api/v1/back/places/', auth).then(response => {
            dispatch(getAllPlaces(response.data.data));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}

export const fetchAllPlaces = (token) => {
    return (dispatch) => {
        dispatch(loadingErrorActions.startRequest());
        const auth = {
            headers: {
                Authorization: "Bearer " + token
            }
        };
        axios.get('http://0.0.0.0:8081/api/v1/back/places/', auth).then(response => {
            dispatch(getAllPlaces(response.data.data));
            dispatch(loadingErrorActions.endRequest());
        }).catch(err => {
            dispatch(loadingErrorActions.errorRequest(err.toString()));
        });
    }
}
