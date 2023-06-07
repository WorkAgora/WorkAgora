import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { NotificationInterface, NotificationKey } from './notifications.interface';
import { CreateNotificationDTO } from '../../dtos/notifications/create-notifications-dto';
import { SortOrder } from 'dynamoose/dist/General';
import { GetNotificationsDTO } from '../../dtos/notifications/get-notifications-dto';
import { ToggleReadStatusDTO } from '../../dtos/notifications/toggle-read-dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notifications')
    private readonly model: Model<NotificationInterface, NotificationKey>
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDTO) {
    try {
      return await this.model.create({
        ...createNotificationDto,
        id: uuidv4(),
        read: false,
        createdAt: new Date().toISOString(),
        type: createNotificationDto.type
      });
    } catch (e) {
      console.log('Error while creating notification', e);
      throw new UnprocessableEntityException('Error while creating notification: ' + e.message);
    }
  }

  async toggleReadStatus(wallet: string, toggleReadStatusDto: ToggleReadStatusDTO) {
    try {
      const notification = await this.model
        .query('userWallet')
        .eq(wallet)
        .where('id')
        .eq(toggleReadStatusDto.notificationId)
        .exec();

      if (!notification) {
        throw new UnprocessableEntityException('Notification not found');
      }

      notification[0].read = !notification[0].read;
      await this.model.update(notification[0]);

      return notification[0];
    } catch (e) {
      console.log('Error while updating notification', e);
      throw new UnprocessableEntityException('Error while updating notification: ' + e.message);
    }
  }

  async getUnreadNotifications(wallet: string): Promise<NotificationInterface[]> {
    try {
      const unreadNotifications = await this.model
        .query('userWallet')
        .eq(wallet)
        .where('read')
        .eq(false)
        .sort(SortOrder.descending)
        .exec();

      if (!unreadNotifications) {
        console.log('No unread notifications found');
        return [];
      }

      return unreadNotifications;
    } catch (error) {
      console.log('Error while getting unread notifications', error);
      throw new UnprocessableEntityException(
        'Error while getting unread notifications: ' + error.message
      );
    }
  }

  async getNotifications(
    wallet: string,
    getNotificationsDto: GetNotificationsDTO
  ): Promise<{ notifications: NotificationInterface[]; maxPage: number; totalResult: number }> {
    try {
      const allNotifications = await this.model
        .query('userWallet')
        .eq(wallet)
        .sort(SortOrder.descending)
        .exec();

      if (!allNotifications) {
        console.log('No notifications found');
        return { notifications: [], maxPage: 0, totalResult: 0 };
      }

      const maxPage = Math.ceil(allNotifications.length / getNotificationsDto.limit);
      const startIndex = (getNotificationsDto.page - 1) * getNotificationsDto.limit;
      const endIndex = getNotificationsDto.page * getNotificationsDto.limit;

      return {
        notifications: allNotifications.slice(startIndex, endIndex),
        maxPage: maxPage,
        totalResult: allNotifications.length
      };
    } catch (error) {
      console.log('Error while getting notifications', error);
      throw new UnprocessableEntityException('Error while getting notifications: ' + error.message);
    }
  }
}
