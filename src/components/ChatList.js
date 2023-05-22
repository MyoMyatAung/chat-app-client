import { useContext } from "react";
import ChatContext from "../contexts/chat-context";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../utils/helpers";
import GroupChatModal from "./Common/GroupChatModal";

function ChatList() {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, chats, setChatsHandler, setSelectedChat } =
    useContext(ChatContext);

  const fetchChats = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/chat`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = await response.json();
      setChatsHandler(data);
    } catch (error) {}
  }, [setChatsHandler]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      height="90vh"
      borderRadius="lg"
      borderWidth="1px"
      m={3}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <Stack overflowY="scroll">
          {chats.map((chat) => {
            return (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

export default ChatList;
