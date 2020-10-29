import {
	FETCH_MATERIALS,
	CREATE_MATERIAL,
	UPDATE_MATERIAL,
	DELETE_MATERIAL,
} from '../actions/material';

const materialReducer = (state = {}, action) => {
	const { type, payload, meta } = action;

	switch (type) {
		case `${FETCH_MATERIALS}_FULFILLED`:
			return {
				...state,
				...payload.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {}),
			};

		case `${CREATE_MATERIAL}_FULFILLED`:
			const { material: materialToCreate } = meta;

			return {
				...state,
				[payload.id]: { id: payload.id, ...materialToCreate },
			};

		case `${UPDATE_MATERIAL}_FULFILLED`:
			const { material: materialToUpdate } = meta;

			return {
				...state,
				[materialToUpdate.id]: materialToUpdate,
			};

		case `${DELETE_MATERIAL}_FULFILLED`:
			const { id: idToDelete } = meta;
			let deleteState = Object.assign(state);
			delete deleteState[idToDelete];
			return deleteState;
		default:
			return state;
	}
};

export default materialReducer;
