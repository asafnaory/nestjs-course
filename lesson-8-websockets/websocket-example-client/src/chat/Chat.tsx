import { RoomsMessages, Message, Rooms } from "../types-and-consts";
import { SingleMessage } from "./message/Message";
import { TextArea } from "./text-area/TextArea";
import "./Chat.css"



export const Chat = (props: { roomMessages: RoomsMessages, username: string, room: Rooms, activeRoom: string }) => {
  const { roomMessages, username, room } = props;
  return (
    <>
      <div className="local-chat-wrapper">
        <div className="rooms-message">
          {roomMessages[room].map((msg:Message, index: number) => {
            return <SingleMessage message={msg} key={index} username={username}/>;
          })}
        </div>
      </div>
      <TextArea username={username} room={room}/>
    </>
  );
};



