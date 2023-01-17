const { compressStr } = require("./utils");

let users = [];

const addUser = (user) => {
  const userName = compressStr(user.username);
  const userRoom = compressStr(user.room);

  const isExist = users.find(
    (u) => compressStr(u.username) === userName && compressStr(u.room) === userRoom,
  );

  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

module.exports = { addUser };
