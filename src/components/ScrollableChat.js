import { useContext } from "react";
import ChatContext from "../contexts/chat-context";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../utils/helpers";

function ScrollableChat({ messages }) {
  const { user } = useContext(ChatContext);

  return (
    <ScrollableFeed>
      {messages.map((m, i) => {
        return (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                fontSize: "16px"
              }}
            >
              {m.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
