export enum NotificationType {
  JOB_CREATED = 'JOB_CREATED',
  JOB_EDITED = 'JOB_EDITED',
  JOB_COMPLETED = 'JOB_COMPLETED',
  JOB_CLOSED = 'JOB_CLOSED',
  JOB_SUCCESS = 'JOB_SUCCESS',
  JOB_DEFERRED_PAID = 'JOB_DEFERRED_PAID',
  JOB_LOCKED_AMOUNT_RELEASED = 'JOB_LOCKED_AMOUNT_RELEASED',
  JOB_INITIAL_DEPOSIT_RELEASED = 'JOB_INITIAL_DEPOSIT_RELEASED',
  JOB_FUNDED_AND_CREATED = 'JOB_FUNDED_AND_CREATED',
  JOB_DECLINED_BY_FREELANCER = 'JOB_DECLINED_BY_FREELANCER',
  JOB_DECLINED_BY_COMPANY = 'JOB_DECLINED_BY_COMPANY',
  JOB_APPROVED_BY_FREELANCER = 'JOB_APPROVED_BY_FREELANCER',
  JOB_APPROVED_BY_COMPANY = 'JOB_APPROVED_BY_COMPANY'
}

export interface NotificationKey {
  userWallet: string; // PK
}

export interface NotificationInterface {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: string; // enum from notificationType
  createdAt: string; // SK
}