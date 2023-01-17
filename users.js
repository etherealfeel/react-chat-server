const { compressStr } = require("./utils");

let users = [];

const findUser = (user) => {
  const userName = compressStr(user.username);
  const userRoom = compressStr(user.room);

  return users.find(
    (u) => compressStr(u.username) === userName && compressStr(u.room) === userRoom,
  );
};

const addUser = (user) => {
  const isExist = findUser(user);

  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

const removeUser = (user) => {
  const found = findUser(user);
  if (found) {
    users = users.filter(({ room, username }) => room === found.room && username !== found.username);
  }

  return found;
};

const getTotalUsers = (room) => {
  return users.filter((u) => u.room === room).length;
};

module.exports = { addUser, findUser, getTotalUsers, removeUser };
