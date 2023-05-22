import { useReducer } from "react";
import ChatContext from "./chat-context";
import { userReducer } from "../reducers/user-reducer";
import { setUserAction } from "../actions/userActions";
import { useEffect } from "react";
import { selectedChatReducer } from "../reducers/selected-chat-reducer";
import { setSelectedChatAction } from "../actions/selectedChatActions";
import { chatsReducer } from "../reducers/chats-reducers";
import { setChatsAction, updateChatsAction } from "../actions/chatsActions";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { notificationReducer } from "../reducers/notification-reducers";
import { setNotificationAction } from "../actions/notificationActions";

const ChatProvider = ({ children }) => {
  const history = useHistory();

  const [userState, dispatchUser] = useReducer(userReducer, null);
  const [selectedChat, dispatchSelectedChat] = useReducer(
    selectedChatReducer,
    null
  );
  const [chats, dispatchChats] = useReducer(chatsReducer, []);
  const [notifications, dispatchNoti] = useReducer(notificationReducer, []);

  const setUserHandler = useCallback((user) => {
    dispatchUser(setUserAction(user));
  }, []);

  const setSelectedChat = useCallback((chat) => {
    dispatchSelectedChat(setSelectedChatAction(chat));
  }, []);

  const setChatsHandler = useCallback((chats) => {
    dispatchChats(setChatsAction(chats));
  }, []);

  const updateChatsHandler = useCallback((chat) => {
    dispatchChats(updateChatsAction(chat));
  }, []);

  const setNotificationHandler = useCallback((noti) => {
    dispatchNoti(setNotificationAction(noti));
  }, []);

  const provider = {
    user: userState,
    selectedChat: selectedChat,
    chats: chats,
    notifications: notifications,
    setUserHandler: setUserHandler,
    setSelectedChat: setSelectedChat,
    setChatsHandler: setChatsHandler,
    updateChatsHandler: updateChatsHandler,
    setNotificationHandler: setNotificationHandler,
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    setUserHandler(JSON.parse(userInfo));

    if (!userInfo) {
      history.push("/");
    }
  }, [history, setUserHandler]);

  return (
    <ChatContext.Provider value={provider}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
