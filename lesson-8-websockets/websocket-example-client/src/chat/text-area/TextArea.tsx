import { useState } from "react";
import { getMySocket } from "../../types-and-consts";
import "./TextArea.css";

const socket = getMySocket();

export const TextArea = (props: { username: string, room: string }) => {
  const { username, room } = props;
  const [messageText, setMessageText] = useState<string>("");

  return (
    <form onSubmit={sendMessage}>
      <div style={{ display: "flex" }}>
        <textarea
          onChange={(e) => setStateMessageText(e.target.value)}
          className="text-area"
          value={messageText}
          placeholder="What do you want to say?"
        ></textarea>
        <button
          className="text-area-button"
          type="submit"
        >
          send
        </button>
      </div>
    </form>
  );

  function setStateMessageText(event: any) {
    setMessageText(event);
  }
  function sendMessage(event: any) {
    event.preventDefault();
    socket.emit("chatToServer", {
      sender: username,
      room: room,
      message: messageText,
    });
    setMessageText("");
  }
};
