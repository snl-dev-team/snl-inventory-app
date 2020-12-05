import {
  TOGGLE_VIEW,
  SET_CARDS_VIEW,
  SET_GRID_VIEW,
} from '../actions/view';

import VIEW_MODES from '../constants/viewModes';

const viewReducer = (state = VIEW_MODES.CARDS, action) => {
  const { type } = action;
  switch (type) {
    case TOGGLE_VIEW:
      return state === VIEW_MODES.CARDS ? VIEW_MODES.GRID : VIEW_MODES.CARDS;
    case SET_CARDS_VIEW:
      return VIEW_MODES.CARDS;
    case SET_GRID_VIEW:
      return VIEW_MODES.GRID;
    default:
      return state;
  }
};

export default viewReducer;
