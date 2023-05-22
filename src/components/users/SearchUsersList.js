import UserListItem from "./UserListItem";

function SearchUsersList({ users, onSearchedUserClick }) {
  return (
    <>
      {users.slice(0,4).map((user) => {
        return (
          <UserListItem
            user={user}
            key={user._id}
            handleClick={() => onSearchedUserClick(user)}
          />
        );
      })}
    </>
  );
}

export default SearchUsersList;
