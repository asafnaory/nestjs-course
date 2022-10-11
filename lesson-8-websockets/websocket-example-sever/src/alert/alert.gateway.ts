import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/alert' })
export class AlertGateway {
  @WebSocketServer() wss: Server;

  sendToAll(message: string) {
    this.wss.emit('alertToClient', { type: 'Alert', message });
  }
}
