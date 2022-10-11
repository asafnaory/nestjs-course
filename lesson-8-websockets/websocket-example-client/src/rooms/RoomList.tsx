import { Rooms } from "../types-and-consts";
import "./RoomList.css";

export const RoomList = (props: {
  rooms: string[];
  setActiveRoomHandler: (room: Rooms) => void;
  activeRoom: string;
}) => {
  const { rooms, setActiveRoomHandler, activeRoom } = props;
  return (
    <div className="local-room-list-wrapper">
      {rooms.map((room, index) => {
        return (
          <button
            onClick={() => setActiveRoomHandler(room as Rooms)}
            className={room === activeRoom ? "active-room" : "inactive-room"} >
            <h4>{room}</h4>
          </button>
        );
      })}
    </div>
  );
};
