import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../contexts/chat-context";
import SingleChat from "./SingleChat";

function ChatBox() {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      backgroundColor="white"
      w={{ base: "100%", md: "68%" }}
      height="90vh"
      m={3}
      borderRadius="lg"
      borderWidth="1px"
    >
      {!!selectedChat ? (
        <SingleChat />
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default ChatBox;
