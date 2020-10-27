import { FETCH_MATERIALS, CREATE_MATERIAL } from '../actions/material';

const materialReducer = (state = {}, action) => {
	const { type, payload } = action;

	switch (type) {
		case `${FETCH_MATERIALS}_FULFILLED`:
			return {
				...state,
				...payload.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {}),
			};

		case CREATE_MATERIAL:
			return state;

		case `${CREATE_MATERIAL}_FULFILLED`:
			return state;
		default:
			return state;
	}
};

export default materialReducer;
