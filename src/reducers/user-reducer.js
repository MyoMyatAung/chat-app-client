import { SET_USER } from "../actions/actionTypes";

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
