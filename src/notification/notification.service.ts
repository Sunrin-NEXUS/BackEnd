import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

@Injectable()
export class NotificationService {
  private server: Server;
  private logger = new Logger('NotificationService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async handleSocketConnection(client: Socket) {
    const accessToken = client.handshake.auth?.token;
    if (!accessToken) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.prisma.user.findUnique({
        where: { uuid: payload.uuid },
        include: { subscribes: true },
      });

      if (!user) {
        client.disconnect();
        return;
      }

      client.join(user.uuid);
      this.logger.log(`User ${user.uuid} joined room`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleSocketDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async markAsRead(notificationId: number) {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async notifyUsersOfNewArticle({
    articleUuid,
    companyId,
    companyName,
    articleTitle,
  }: {
    articleUuid: string;
    companyId: string;
    companyName: string;
    articleTitle: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: {
        subscribes: {
          some: { uuid: companyId },
        },
      },
    });

    for (const user of users) {
      const notification = await this.prisma.notification.create({
        data: {
          userId: user.uuid,
          articleId: articleUuid,
          isRead: false,
        },
      });

      this.server.to(user.uuid).emit('new-notification', {
        notificationId: notification.id,
        articleUuid,
        companyName,
        articleTitle,
        createdAt: notification.createdAt,
      });
    }
  }
  
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            article: {
                include: {
                    company: true
                }
            }
        }
    });
}

}
