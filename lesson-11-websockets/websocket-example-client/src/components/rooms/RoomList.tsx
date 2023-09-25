import { Rooms } from "../../types-and-consts";
import "./RoomList.css";

const RoomList = (props: {
  rooms: string[];
  setActiveRoomHandler: (room: Rooms) => void;
  activeRoom: string;
}) => {
  const { rooms, setActiveRoomHandler, activeRoom } = props;
  return (
    <div className="local-room-list-wrapper">
      {rooms.map((room) => {
        return (
          <button
            key={crypto.randomUUID()}
            onClick={() => setActiveRoomHandler(room as Rooms)}
            className={room === activeRoom ? "active-room" : "inactive-room"}
          >
            <h4>{room}</h4>
          </button>
        );
      })}
    </div>
  );
};

export default RoomList;
