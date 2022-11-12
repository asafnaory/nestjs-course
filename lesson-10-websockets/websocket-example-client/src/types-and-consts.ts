
import io from "socket.io-client";



export function getUserName(): string {
  const username = prompt("Please enter your name", "my username");
  return username || 'my username';
}
export const username = `${getUserName()}`;

export enum Rooms {
  GENERAL = "general",
  TYPESCRIPT = "typescript",
  NESTJS = "nestjs",
}

export const roomNameList = [Rooms.GENERAL, Rooms.TYPESCRIPT, Rooms.NESTJS];
export interface Message {
  sender: string;
  room: string;
  message: string;
}

export type RoomMembership = Record<Rooms, boolean>;
export type RoomsMessages = Record<Rooms, Message[]>;


let mySocket: any; 

export function getMySocket() {
  if(!mySocket){
    mySocket = io("http://localhost:8080/chat");
    return mySocket;
  }
  return mySocket;
}
