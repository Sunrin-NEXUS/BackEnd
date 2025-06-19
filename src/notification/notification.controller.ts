import { Controller, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AccessGuard } from 'src/auth/guard/access.guard';

@Controller('notification')
@UseGuards(AccessGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Request() req) {
    const user = req.user;
    return await this.notificationService.getUserNotifications(user.uuid);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    return await this.notificationService.markAsRead(id);
  }
}
