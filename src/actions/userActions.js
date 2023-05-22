import { SET_USER } from "./actionTypes";

export const setUserAction = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};
