import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('chatToServer')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { sender: string; room: string; message: string },
  ): void {
    this.wss.to(message.room).emit('chatToClient', message);
  }
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() requestToJoinRoomInfo: { room: string; user: string },
  ) {
    const { room, user } = requestToJoinRoomInfo;
    socket.join(room);
    socket.to(room).emit('joinedRoom', { room, user });
  }
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() requestToLeaveRoomInfo: { room: string; user: string },
  ) {
    const { room, user } = requestToLeaveRoomInfo;
    socket.leave(room);
    socket.to(room).emit('leftRoom', { room, user });
  }
}
