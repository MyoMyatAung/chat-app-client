import { SET_SELECTED_CHAT } from "../actions/actionTypes";

export const selectedChatReducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_CHAT:
      return { ...action.payload };

    default:
      return state;
  }
};
