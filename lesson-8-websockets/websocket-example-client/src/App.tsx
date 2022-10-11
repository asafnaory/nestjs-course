import React, { useEffect, useState } from "react";
import { Chat } from "./chat/Chat";
import { RoomList } from "./rooms/RoomList";
import {
  RoomsMessages,
  Rooms,
  RoomMembership,
  roomNameList,
  username,
  Message,
  getMySocket,
} from "./types-and-consts";
import "./App.css";
const socket = getMySocket();

function App() {
  const [roomsMessages, setRoomsMessages] = useState<RoomsMessages>({
    general: [],
    typescript: [],
    nestjs: [],
  });
  const [activeRoom, setActiveRoom] = useState<Rooms>(Rooms.GENERAL);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinRoom", { room: activeRoom, user: username });
    });
    socket.on("chatToClient", (msg: Message) => {
      receiveChatMessage(msg);
    });

    // user joined and left the room:

    // socket.on("joinedRoom", (info: { room: string; user: string }) => {
    //   const { room, user } = info;
    //   console.log(room, user);
    //   const msg: Message = {
    //     sender: "Admin",
    //     room,
    //     message: `user ${user} has joined the room`,
    //   };
    //   receiveChatMessage(msg);
    // });
    // socket.on("leftRoom", (info: { room: string; user: string }) => {
    //   const { room, user } = info;
    //   const msg: Message = {
    //     sender: "Admin",
    //     room,
    //     message: `user ${user} has left the room`,
    //   };
    //   receiveChatMessage(msg);
    // });

  }, [username, activeRoom, receiveChatMessage]);

  return (
    <div className="app-wrapper">
      <div className="room-list-wrapper">
        <RoomList
          activeRoom={activeRoom}
          rooms={roomNameList}
          setActiveRoomHandler={setActiveRoomHandler}
        />
      </div>
      <div className="room-and-chat-wrapper">
        <h2>Room: {activeRoom}</h2>
        <div className="chat-wrapper">
          <Chat
            roomMessages={roomsMessages}
            activeRoom={activeRoom}
            username={username}
            room={activeRoom}
          />
        </div>
      </div>
    </div>
  );

  function toggleRoomMembership(roomMembership: RoomMembership) {
    console.log(roomMembership);
    for (const room in roomMembership) {
      if (roomMembership[room as Rooms] === true) {
        socket.emit("joinRoom", { room, user: username });
      } else {
        socket.emit("leaveRoom", { room, user: username });
      }
    }
  }

  function receiveChatMessage(msg: Message) {
    let newMessages;
    if (msg.room === Rooms.GENERAL) {
      newMessages = {
        ...roomsMessages,
        general: [...roomsMessages.general, msg],
      };
    } else if (msg.room === Rooms.TYPESCRIPT) {
      newMessages = {
        ...roomsMessages,
        typescript: [...roomsMessages.typescript, msg],
      };
    } else {
      newMessages = {
        ...roomsMessages,
        nestjs: [...roomsMessages.nestjs, msg],
      };
    }
    setRoomsMessages(newMessages);
  }
  function setActiveRoomHandler(newActiveRoom: Rooms) {
    let newRoomMembership = {
      [Rooms.GENERAL]: false,
      [Rooms.TYPESCRIPT]: false,
      [Rooms.NESTJS]: false,
    };

    for (const room in newRoomMembership) {
      if (room === newActiveRoom) {
        newRoomMembership[newActiveRoom] = true;
      }
    }
    setActiveRoom(newActiveRoom);
    toggleRoomMembership(newRoomMembership);
  }
}

export default App;
