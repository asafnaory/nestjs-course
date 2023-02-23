import io, { Socket } from "socket.io-client";
export interface Message {
  sender: string;
  room: Rooms;
  message: string;
}

export type RoomsMessages = Record<Rooms, Message[]>;

export enum SocketEventTypes {
  CONNECT = "connect",
  SERVER_MESSAGE_EVENT = "serverMessagesEvent",
  CLIENT_MESSAGE_EVENT = "clientMessagesEvent",
  JOINED_ROOM = "joinedRoom",
  LEFT_ROOM = "leftRoom",
  JOIN_ROOM = "joinRoom",
  LEAVE_ROOM = "leaveRoom",
}

export enum Rooms {
  GENERAL = "general",
  TYPESCRIPT = "typescript",
  NESTJS = "nestjs",
}

export const roomNameList = [Rooms.GENERAL, Rooms.TYPESCRIPT, Rooms.NESTJS];

let mySocket: Socket;
export function getMySocket() {
  if (!mySocket) {
    mySocket = io("http://localhost:8080/chat");
    return mySocket;
  }
  return mySocket;
}
