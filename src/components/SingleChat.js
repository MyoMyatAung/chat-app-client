import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../contexts/chat-context";
import { getSender } from "../utils/helpers";
import { ViewIcon } from "@chakra-ui/icons";
import GroupChatModal from "./Common/GroupChatModal";
import ProfileModal from "./Common/ProfileModal";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import "../App.css";

const endpoint = "http://localhost:5000";
let socket, selectedChatCompare;

function SingleChat() {
  const { selectedChat, user, notifications, setNotificationHandler } =
    useContext(ChatContext);

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageLoading, setNewMessageLoading] = useState(false);

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connected");
  }, [user, selectedChat._id]);

  useEffect(() => {
    socket.on("message-receive", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        setNotificationHandler([...notifications, newMessageRecieved]);
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });
  }, [setNotificationHandler, notifications]);

  const handleFetchMessage = useCallback(async () => {
    if (!selectedChat) return;
    try {
      setMessageLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/message/${selectedChat._id}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = await response.json();
      setMessages(data);
      setMessageLoading(false);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      setMessageLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, toast]);

  async function handleSendMessage(e) {
    if (newMessage.length < 0 || newMessage.trim() === "") return;
    if (e.key !== "Enter") return;
    try {
      setNewMessageLoading(true);
      setNewMessage("");
      const url = `${process.env.REACT_APP_API_URL}/message/send-message`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ chatId: selectedChat._id, content: newMessage }),
      });
      const { data } = await response.json();
      setMessages((prev) => [...prev, data]);
      socket.emit("new-message", data);
      setNewMessageLoading(false);
    } catch (error) {
      setNewMessageLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Send the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  function handleNewMessageChange(e) {
    setNewMessage(e.target.value);
  }

  useEffect(() => {
    handleFetchMessage();
    selectedChatCompare = selectedChat;
  }, [handleFetchMessage, selectedChat]);

  let scrollableMessagesContent;

  if (messageLoading) {
    scrollableMessagesContent = (
      <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
    );
  }

  if (!messageLoading && messages.length > 0) {
    scrollableMessagesContent = (
      <div className="messages">
        <ScrollableChat messages={messages} />
      </div>
    );
  }

  return (
    <>
      <Box
        fontSize={{ base: "28px", md: "30px" }}
        w="100%"
        h="100%"
        fontFamily="Work sans"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          w="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontFamily="Work sans"
        >
          <Text fontSize="3xl" fontFamily="Work sans">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(user, selectedChat.users)}
          </Text>
          {selectedChat.isGroupChat ? (
            <GroupChatModal selectedGroupChat={selectedChat} mode="EDIT">
              <IconButton icon={<ViewIcon />} />
            </GroupChatModal>
          ) : (
            <ProfileModal
              user={selectedChat.users.filter((u) => u._id !== user._id)[0]}
            />
          )}
        </Box>
        <Box
          m={5}
          backgroundColor="lightgray"
          w="100%"
          h="100%"
          overflowY="scroll"
          borderRadius={5}
          p={5}
        >
          {scrollableMessagesContent}
        </Box>
        <FormControl onKeyDown={handleSendMessage}>
          <Input
            disabled={newMessageLoading}
            placeholder={
              newMessageLoading
                ? "Your message is sending..."
                : "Enter you message..."
            }
            value={newMessage}
            onChange={handleNewMessageChange}
          />
        </FormControl>
      </Box>
    </>
  );
}

export default SingleChat;
