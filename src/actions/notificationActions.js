import { SET_NOTI } from "./actionTypes";

export const setNotificationAction = (noti) => {
  return {
    type: SET_NOTI,
    payload: noti,
  };
};
