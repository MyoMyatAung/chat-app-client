import { SET_CHATS, UPDATE_CHATS } from "../actions/actionTypes";

export const chatsReducer = (state, action) => {
  switch (action.type) {
    case SET_CHATS:
      return [...action.payload];
    case UPDATE_CHATS:
      const stateCpy = [...state];
      const index = stateCpy.findIndex((s) => s._id === action.payload._id);
      const arr = stateCpy.splice(0, index).concat(stateCpy.slice(index + 1));
      return [action.payload, ...arr];
    default:
      return state;
  }
};
