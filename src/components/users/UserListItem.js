import { Avatar, Box, Text } from "@chakra-ui/react";

function UserListItem({ user, handleClick }) {
  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      mt={2}
      borderRadius="lg"
    >
      <Avatar size="sm" marginRight={2} src={user.profilePic} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
