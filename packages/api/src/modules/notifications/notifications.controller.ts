import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreateNotificationDTO } from '../../dtos/notifications/create-notifications-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { NotificationInterface } from './notifications.interface';
import { ToggleReadStatusDTO } from '../../dtos/notifications/toggle-read-dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { NotificationDTO } from '../../dtos/notifications/notification-dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiBody({ type: CreateNotificationDTO })
  @ApiResponse({
    status: 200,
    description: 'The Notification',
    type: CreateNotificationDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async create(@Body() createNotificationDto: CreateNotificationDTO) {
    return await this.notificationService.createNotification(createNotificationDto);
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all unread notifications related to a specific user (defined by token)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of unread notifications',
    type: [CreateNotificationDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getUnread(@Req() req: Request) {
    const { wallet } = req.user;
    return await this.notificationService.getUnreadNotifications(wallet);
  }

  @Put('toggle-read-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle the read status of a notification' })
  @ApiBody({ type: ToggleReadStatusDTO })
  @ApiResponse({
    status: 200,
    description: 'The updated notification',
    type: NotificationDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async toggleReadStatus(
    @Req() req: Request,
    @Body() toggleReadStatusDto: ToggleReadStatusDTO
  ): Promise<NotificationInterface> {
    const { wallet } = req.user;
    return await this.notificationService.toggleReadStatus(wallet, toggleReadStatusDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notifications related to a specific user (defined by token)' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: [CreateNotificationDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getNotifications(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<{ notifications: NotificationInterface[]; maxPage: number; totalResult: number }> {
    const { wallet } = req.user;
    return await this.notificationService.getNotifications(wallet, { page, limit });
  }
}
