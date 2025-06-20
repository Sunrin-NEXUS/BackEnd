import { Controller, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger'
import {NotificationResponseDto} from './dto/NotificationResponseDto'
import { NotificationService } from './notification.service';
import { AccessGuard } from 'src/auth/guard/access.guard';

@Controller('notification')
@UseGuards(AccessGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: '내 알림 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '알림 목록 조회 성공',
    type: NotificationResponseDto,
  })
  @Get()
  async getMyNotifications(@Request() req): Promise<NotificationResponseDto> {
    const user = req.user;
    return await this.notificationService.getUserNotifications(user.uuid);
  }

  @Patch(':id')
  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '읽음 처리할 알림의 ID',
    example: 123,
  })
  @ApiResponse({ status: 200, description: '알림이 읽음 처리되었습니다.' })
  async markAsRead(@Param('id') id: number) {
    await this.notificationService.markAsRead(id);
  }
}
