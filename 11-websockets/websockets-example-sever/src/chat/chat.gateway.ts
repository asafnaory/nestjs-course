import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketEventTypes } from 'src/chat/events/events.enum';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() wss: Server;

  afterInit(_: any) {
    console.log(`server has started`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`client ${socket.id} is Disconnect`);
  }
  handleConnection(@ConnectedSocket() socket: Socket, _: any[]) {
    console.log(`client ${socket.id} is Connected`);
  }

  @SubscribeMessage(SocketEventTypes.SERVER_MESSAGE_EVENT)
  handleMessage(
    @MessageBody() message: { sender: string; room: string; message: string },
  ): void {
    this.wss
      .to(message.room)
      .emit(SocketEventTypes.CLIENT_MESSAGE_EVENT, message);
  }
  @SubscribeMessage(SocketEventTypes.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() requestToJoinRoomInfo: { room: string; user: string },
  ) {
    const { room, user } = requestToJoinRoomInfo;
    console.log(`${user} has requested to join room ${room}`);
    socket.join(room);
    socket.to(room).emit(SocketEventTypes.JOINED_ROOM, { room, user });
  }
  @SubscribeMessage(SocketEventTypes.LEAVE_ROOM)
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() requestToLeaveRoomInfo: { room: string; user: string },
  ) {
    const { room, user } = requestToLeaveRoomInfo;
    console.log(`${user} has requested to leave room ${room}`);
    socket.leave(room);
    socket.to(room).emit(SocketEventTypes.LEFT_ROOM, { room, user });
  }
}
