import { Message } from "../../../types-and-consts";
import "./Message.css";

export const SingleMessage = (props: { message: Message, username: string }) => {
  const { message, username } = props;
  return (
    <div
      className={
        message.sender === username
          ? "my-message-wrapper"
          : message.sender === "Admin"
          ? "admin-message-wrapper"
          : "others-message-wrapper"
      }
    >
      <h4>{message.sender}:</h4>
      <h4>{message.message}</h4>
    </div>
  );
};
