import { SET_NOTI } from "../actions/actionTypes";

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_NOTI:
      return action.payload;

    default:
      return state;
  }
};
