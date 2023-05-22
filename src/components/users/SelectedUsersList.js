import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

function SelectedUsersList({ users, onSelectedUserClick }) {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexWrap="wrap"
      width="100%"
      marginY={2}
    >
      {users.map((user) => {
        return (
          <Box
            key={user._id}
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            backgroundColor="skyblue"
            p={2}
            borderRadius={4}
            m={1}
            onClick={() => onSelectedUserClick(user)}
          >
            {user.name}
            <CloseIcon fontSize="2xs" ml={2} />
          </Box>
        );
      })}
    </Box>
  );
}

export default SelectedUsersList;
