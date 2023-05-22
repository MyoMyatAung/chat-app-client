import { SET_CHATS, UPDATE_CHATS } from "./actionTypes";

export const setChatsAction = (chats) => {
  return {
    type: SET_CHATS,
    payload: chats,
  };
};

export const updateChatsAction = (chat) => {
  return {
    type: UPDATE_CHATS,
    payload: chat,
  };
};
