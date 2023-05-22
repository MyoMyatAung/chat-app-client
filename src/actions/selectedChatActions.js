import { SET_SELECTED_CHAT } from "./actionTypes";

export const setSelectedChatAction = (chat) => {
  return {
    type: SET_SELECTED_CHAT,
    payload: chat,
  };
};
