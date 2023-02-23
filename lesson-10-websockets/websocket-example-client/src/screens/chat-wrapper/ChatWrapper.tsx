import { useState } from "react";
import Chat from "../../components/chat/Chat";
import RoomList from "../../components/rooms/RoomList";
import {
  getMySocket,
  Rooms,
  Message,
  roomNameList,
  SocketEventTypes,
  RoomsMessages,
} from "../../types-and-consts";
import "./ChatWrapper.css";
import { useConnectToSocket } from "./useConnectToSocket";

function ChatWrapper({ username }: { username: string }) {
  const socket = getMySocket();
  const [activeRoom, setActiveRoom] = useState<Rooms>(Rooms.GENERAL);
  const [roomsMessages, setRoomsMessages] = useState<RoomsMessages>({
    general: [],
    typescript: [],
    nestjs: [],
  });
  useConnectToSocket(activeRoom, username, receiveChatMessage);

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
        <div className="info">
          <h2>Room: {activeRoom}</h2>
          <h2>Username: {username}</h2>
        </div>
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
  function receiveChatMessage(msg: Message) {
    const newMessages = {
      ...roomsMessages,
      [msg.room]: [...roomsMessages[msg.room], msg],
    };
    setRoomsMessages(newMessages);
  }

  function toggleRoomMembership(newActiveRoom: Rooms, oldActiveRoom: Rooms) {
    socket.emit(SocketEventTypes.JOIN_ROOM, {
      room: newActiveRoom,
      user: username,
    });
    socket.emit(SocketEventTypes.LEAVE_ROOM, {
      room: oldActiveRoom,
      user: username,
    });
  }

  function setActiveRoomHandler(newActiveRoom: Rooms) {
    toggleRoomMembership(newActiveRoom, activeRoom);
    setActiveRoom(newActiveRoom);
  }
}

export default ChatWrapper;
