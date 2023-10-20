type User = {
  socketID: string;
  name: string;
};

type RoomInfo = {
  admin: User | undefined;
  members: User[];
};

const rooms = new Map<string, RoomInfo>();

const hasRoom = (roomID: string) => {
  return rooms.has(roomID);
};

const getRoom = (roomID: string) => {
  return rooms.get(roomID);
};

const addRoom = (roomID: string) => {
  rooms.set(roomID, {
    admin: undefined,
    members: [],
  });
};

const deleteRoom = (roomID: string) => {
  return rooms.delete(roomID);
};

const getMembers = (roomID: string) => {
  return rooms.get(roomID)?.members;
};

const getAdmin = (roomID: string) => {
  return rooms.get(roomID)?.admin;
};

const addMember = (roomID: string, user: User) => {
  const roomInfo = rooms.get(roomID);

  if (roomInfo?.admin === undefined) {
    roomInfo!.admin = user;
  } else {
    roomInfo.members.push(user);
  }
};

// const removeMember = (roomID: string, user: User) => {
//   const roomInfo = rooms.get(roomID);
// };

export {
  hasRoom,
  getRoom,
  addRoom,
  deleteRoom,
  getMembers,
  getAdmin,
  addMember,
};
