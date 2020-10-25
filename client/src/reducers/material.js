import { FETCH_MATERIALS } from '../actions/material';

const materialReducer = (state = {}, action) => {

    const { type, payload } = action;

    switch (type) {
        case `${FETCH_MATERIALS}_FULFILLED`:
            return { 
                ...state,
                ...payload.reduce((acc, curr) => {
                    acc[curr.id] = curr;
                    return acc;
                }, {})

        };
        default:
            return state;
    }
};

export default materialReducer;