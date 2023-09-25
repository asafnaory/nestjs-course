import { useEffect } from "react";
import {
  getMySocket,
  Message,
  Rooms,
  SocketEventTypes,
} from "../../types-and-consts";

export const useConnectToSocket = (
  activeRoom: Rooms,
  username: string,
  receiveChatMessage: (msg: Message) => void
) => {
  const socket = getMySocket();
  useEffect(() => {
    // When component mounts it should send an joinRoom event
    socket.on(SocketEventTypes.CONNECT, () => {
      socket.emit(SocketEventTypes.JOIN_ROOM, {
        room: activeRoom,
        user: username,
      });
    });

    // Events the client listens to:
    // 1 chatToClient: messages from all clients
    socket.on(SocketEventTypes.CLIENT_MESSAGE_EVENT, (msg: Message) => {
      receiveChatMessage(msg);
    });

    // 2 joinedRoom when other client has joined the room:
    socket.on(
      SocketEventTypes.JOINED_ROOM,
      (info: { room: Rooms; user: string }) => {
        const { room, user } = info;
        // console.log(`${user} joined room ${room}`);
        const msg: Message = {
          sender: "Admin",
          room,
          message: `user ${user} has joined the room`,
        };
        receiveChatMessage(msg);
      }
    );

    // 3 leftRoom when other client has left the room:
    socket.on(
      SocketEventTypes.LEFT_ROOM,
      (info: { room: Rooms; user: string }) => {
        const { room, user } = info;
        // console.log(`${user} left room ${room}`);
        const msg: Message = {
          sender: "Admin",
          room,
          message: `user ${user} has left the room`,
        };
        receiveChatMessage(msg);
      }
    );
  }, [activeRoom, socket, username, receiveChatMessage]);
};
