export const TOGGLE_VIEW = 'TOGGLE_VIEW';
export const SET_GRID_VIEW = 'SET_GRID_VIEW';
export const SET_CARDS_VIEW = 'SET_CARD_VIEW';

export const toggleView = () => ({
  type: TOGGLE_VIEW,
});

export const setGridView = () => ({
  type: SET_GRID_VIEW,
});

export const setCardsView = () => ({
  type: SET_CARDS_VIEW,
});
