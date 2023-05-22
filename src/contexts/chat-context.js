import React from "react";

const ChatContext = React.createContext({
  user: null,
  selectedChat: null,
  chats: [],
  notification: [],
  setUserHandler: (user) => {},
  setSelectedChat: (chat) => {},
  setChatsHandler: (chats) => {},
  updateChatsHandler: (chat) => {},
  setNotificationHandler: (noti) => {},
});

export default ChatContext;
