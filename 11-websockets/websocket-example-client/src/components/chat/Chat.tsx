import { SingleMessage } from "./message/Message";
import { TextArea } from "./text-area/TextArea";
import "./Chat.css"
import { RoomsMessages, Rooms, Message } from "../../types-and-consts";



const Chat = (props: { roomMessages: RoomsMessages, username: string, room: Rooms, activeRoom: string }) => {
  const { roomMessages, username, room } = props;
  return (
    <>
      <div className="local-chat-wrapper">
        <div className="rooms-message">
          {roomMessages[room].map((msg:Message) => {
            return <SingleMessage message={msg} key={crypto.randomUUID()} username={username}/>;
          })}
        </div>
      </div>
      <TextArea username={username} room={room}/>
    </>
  );
};

export default Chat


