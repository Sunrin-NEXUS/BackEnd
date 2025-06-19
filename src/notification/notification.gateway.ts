import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@WebSocketGateway(
  process.env.PORT ? Number(process.env.PORT)+1 : 3001,
  {
    namespace: 'notification',
    cors: {origin: ['http://localhost:3000', 'http://localhost:3001']}
  }
)
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('NotificationGateway');

  constructor(
    private readonly notificationService: NotificationService
  ) {}

  private server: Server;

  afterInit(server: Server) {
    this.server = server;
    this.notificationService.setServer(server)
    this.logger.log('WebSocket initialized')
  }

  async handleConnection(client: Socket) {
    await this.notificationService.handleSocketConnection(client)
  }

  handleDisconnect(client: Socket) {
    this.notificationService.handleSocketDisconnect(client)
  }
}
