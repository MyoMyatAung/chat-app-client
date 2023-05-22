import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../../contexts/chat-context";
import ProfileModal from "./ProfileModal";
import { useState } from "react";
import UserListItem from "../users/UserListItem";
import { getSender } from "../../utils/helpers";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const {
    user,
    chats,
    notifications,
    setSelectedChat,
    setChatsHandler,
    setNotificationHandler,
  } = useContext(ChatContext);

  const [searchUserLoading, setSearchUserLoading] = useState(false);
  const [searchUserResult, setSearchUserResult] = useState(null);
  const [searchString, setSearchString] = useState("");

  let searchedUsersContent = null;

  if (searchUserLoading) {
    searchedUsersContent = (
      <Stack>
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
      </Stack>
    );
  }

  if (!!searchUserResult && !searchUserLoading) {
    searchedUsersContent = searchUserResult.map((user) => {
      return (
        <UserListItem
          handleClick={() => handleAccessChat(user._id)}
          user={user}
          key={user._id}
        />
      );
    });
  }

  const handleAccessChat = async (_id) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/chat`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: _id }),
      });
      const { data } = await response.json();
      if (!chats.find((c) => c._id === data._id))
        setChatsHandler([data, ...chats]);
      setSelectedChat(data);
      onClose();
    } catch (error) {}
  };

  const handleSearchUser = async () => {
    // if (!!searchString.trim()) {
    //   return;
    // }
    setSearchUserLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/user?search=${searchString}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = await response.json();
      setSearchUserResult(data);
      setSearchUserLoading(false);
    } catch (error) {
      setSearchUserLoading(false);
      toast({
        title: "Fail to search users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  return (
    <>
      <Box
        background={"white"}
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button onClick={onOpen} leftIcon={<SearchIcon />}>
          Search Users
        </Button>
        <Text fontSize="3xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotificationHandler(
                      notifications.filter((n) => n !== notif)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Input
                onChange={handleSearchChange}
                marginRight={1}
                placeholder="Search User..."
              />
              <Button onClick={handleSearchUser}>Go</Button>
            </Box>
            {searchedUsersContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;
