import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import SearchUsersList from "../users/SearchUsersList";
import SelectedUsersList from "../users/SelectedUsersList";
import ChatContext from "../../contexts/chat-context";
import { useEffect } from "react";

function GroupChatModal({
  children,
  selectedGroupChat = null,
  mode = "CREATE",
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const { user } = useContext(ChatContext);

  const [data, setData] = useState({
    name: "",
    users: [],
  });

  useEffect(() => {
    if (!!selectedGroupChat) {
      setData((prev) => {
        return {
          ...prev,
          name: selectedGroupChat.chatName,
          users: selectedGroupChat.users.filter((u) => u._id !== user._id),
        };
      });
    }
  }, [selectedGroupChat, user?._id]);

  const [searchUserLoading, setSearchUserLoading] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);

  const { chats, setChatsHandler, setSelectedChat, updateChatsHandler } = useContext(ChatContext);

  function handleSearchedUserClick(user) {
    const isUserExisted = data.users.some((u) => u._id === user._id);
    if (isUserExisted) {
      return;
    }
    setData((prev) => {
      return { ...prev, users: [...prev.users, user] };
    });
  }

  function handleSelectedUserClick(user) {
    setData((prev) => {
      return { ...prev, users: prev.users.filter((u) => u._id !== user._id) };
    });
  }

  function handleChatNameChange(e) {
    setData((prev) => ({ ...prev, name: e.target.value }));
  }

  let debounceTimer;

  async function fetchUsersByName(query) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/user?search=${query}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response = await fetch(url, { headers });
      const { data } = await response.json();
      return data;
    } catch (error) {
      throw new Error("Fail to search user!");
    }
  }

  function handleSearchUserChange(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async function () {
      const query = e.target.value;
      setSearchUserLoading(true);
      try {
        const searchedUser = await fetchUsersByName(query);
        setSearchUsers(searchedUser);
        setSearchUserLoading(false);
      } catch (error) {
        setSearchUserLoading(false);
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          position: "bottom",
        });
      }
      // TODO: FETCH SEARCH USERS
    }, 500);
  }

  async function handleCreateGroup() {
    setCreateGroupLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/chat/group`;
      if (mode === "EDIT") {
        url += `/${selectedGroupChat._id}`;
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response = await fetch(url, {
        method: mode === "CREATE" ? "POST" : "PUT",
        headers,
        body: JSON.stringify({
          name: data.name,
          users: data.users.map((u) => u._id),
        }),
      });
      const { data: resData } = await response.json();
      if (mode === "CREATE") {
        setChatsHandler([resData, ...chats]);
      }
      if(mode === "EDIT"){
        updateChatsHandler(resData);
      }
      setSelectedChat(resData);
      setCreateGroupLoading(false);
      onClose();
    } catch (error) {
      setCreateGroupLoading(false);
      toast({
        title: `Fail to ${mode === "CREATE" ? "create" : "edit"} group`,
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom",
      });
    }
  }

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

  if (!searchUserLoading && searchUsers.length > 0) {
    searchedUsersContent = (
      <SearchUsersList
        users={searchUsers}
        onSearchedUserClick={handleSearchedUserClick}
      />
    );
  }

  let selectedUsersContent = null;

  if (data.users.length > 0) {
    selectedUsersContent = (
      <SelectedUsersList
        onSelectedUserClick={handleSelectedUserClick}
        users={data.users}
      />
    );
  }

  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Group Chat Name</FormLabel>
              <Input
                placeholder="Eg. Xnova gaming group"
                name="name"
                type="text"
                onChange={handleChatNameChange}
                value={data.name}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Eg. john wick"
                mt={2}
                name="user"
                type="text"
                onChange={handleSearchUserChange}
              />
            </FormControl>
            {selectedUsersContent}
            {searchedUsersContent}
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={createGroupLoading}
              colorScheme="blue"
              mr={3}
              onClick={handleCreateGroup}
            >
              {mode === "CREATE" ? "Create Group" : "Save Group"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
