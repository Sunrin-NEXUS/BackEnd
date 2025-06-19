import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [NotificationController],
  providers: [
    NotificationGateway,
    NotificationService,
    PrismaService,
  ],
  exports: [NotificationService]
})
export class NotificationModule {}
