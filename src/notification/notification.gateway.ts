import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@WebSocketGateway({ cors: true })
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
    this.notificationService.setServer(server);
    this.logger.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    await this.notificationService.handleSocketConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.notificationService.handleSocketDisconnect(client);
  }

  @SubscribeMessage('read-notification')
  async handleReadNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: number },
  ) {
    await this.notificationService.markAsRead(data.notificationId);
  }
}
