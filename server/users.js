const users = [];

// this will add a new user
const createUser = ({ id, name, room }) => {
  // this will allow us to know exactly what
  // string data we are dealing with
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // this will search to see if there is a username
  // that has been created already
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // this will prevent the username to be duplicated
  if (existingUser) {
    return { error: "Username is taken" };
  }

  // if not taken, the new user will be created
  const user = { id, name, room };

  // this will add new user to array of users
  users.push(user);

  // so we know what user was just pushed
  return { user };
};

// this will delete a user
const removeUser = (id) => {
  // checks to see if there is a user with a macthing id
  const index = users.findIndex((user) => user.id === id);

  // this will remove the user
  // filter method can also be used here
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// this will find one user
const getUser = (id) => {
  users.find((user) => user.id === id);
};

// this will find all users in a room
const getUsersInRoom = (room) => {
  users.filter((user) => user.room === room);
};

module.exports = { createUser, removeUser, getUser, getUsersInRoom };
