import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import {NotificationResponseDto} from './dto/NotificationResponseDto'

@Injectable()
export class NotificationService {
  private server: Server;
  private logger = new Logger('NotificationService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async handleSocketConnection(client: Socket) {
    const accessToken = client.handshake.query?.token as string;
    if (!accessToken) {
      client.emit('error', {message: 'no token provided'})
      setTimeout(() => {
        client.disconnect();
      }, 500)
      return;
    }

    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('SECRET_ACCESS_JWT') ?? 'fallback'
      })

      const userUuid = payload?.sub
      if(!userUuid)
        throw new Error('no uuid in token')

      const user = await this.prisma.user.findUnique({
        where: { uuid: userUuid },
        include: { subscribes: true },
      });

      if (!user) {
        client.emit('error', {message: 'User Not Found'})
        setTimeout(() => {
          client.disconnect();
        }, 500)
        return;
      }

      client.join(user.uuid);
      this.logger.log(`User ${user.uuid} joined room`);
    } catch (err) {
        client.emit('error', {message: 'Invaild token'})
        setTimeout(() => {
          client.disconnect();
        }, 500)
    }
  }

  handleSocketDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async markAsRead(notificationId: number) {
    if(Number.isNaN(notificationId))
      throw new Error('id must be a number')
    notificationId = Number(notificationId)
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      })
    } catch(e) {
      this.logger.error(e)
    }

    return 'success'
  }

  async notifyUsersOfNewArticle({
    articleUuid,
    companyUuid,
  }: {
    articleUuid: string;
    companyUuid: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: {
        subscribes: {
          some: { uuid: companyUuid },
        },
      },
    })

    const company = await this.prisma.company.findUnique({
      where: {uuid: companyUuid}
    })
    const article = await this.prisma.article.findUnique({
      where: {uuid: articleUuid}
    })

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
        title: article?.summaryTitle ?? article?.title,
        contents: article?.summaryContents,
        companyProfileImageUrl: company?.profileImageUrl,
        createdAt: notification.createdAt,
        ...(article?.summaryMediaUrl && article.summaryMediaType && {
          media: {
            type: article?.summaryMediaType,
            url: article?.summaryMediaUrl
          },
        })
      });
    }
  }
  
  async getUserNotifications(userId: string): Promise<NotificationResponseDto> {
    const res = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
          article: {
              include: {
                  company: true
              }
          }
      }
    })
    return {
      items: res.map(v => ({
        title: v.article.title,
        contents: v.article.summaryContents,
        company: {
          uuid: v.article.company.uuid,
          name: v.article.company.name,
          profileImageUrl: v.article.company.profileImageUrl,
        },
        ...(v.article.summaryMediaType && v.article.summaryMediaUrl && {
          media: {
            mediaType: v.article.summaryMediaType as 'image' | 'video',
            url: v.article.summaryMediaUrl
          }
        })
      }))
    }
  }
}
