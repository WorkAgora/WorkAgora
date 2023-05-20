import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { KycModule } from './modules/kyc/kyc.module';
import { JobModule } from './modules/job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot({
      local: process.env.IS_DDB_LOCAL === 'true',
      aws: { region: process.env.AWS_REGION },
      table: {
        create: process.env.IS_DDB_LOCAL === 'true',
        prefix: `${process.env.AWS_SERVICE}-${process.env.AWS_STAGE}`,
        suffix: '-table'
      }
    }),
    UserModule,
    AuthModule,
    KycModule,
    JobModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
