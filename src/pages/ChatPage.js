import { Box } from "@chakra-ui/react";
import Header from "../components/Common/Header";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

function ChatPage() {
  return (
    <div style={{ width: "100%" }}>
      <Header />
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <ChatList />
        <ChatBox />
      </Box>
    </div>
  );
}

export default ChatPage;
