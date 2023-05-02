import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { SiweStrategy } from './siwe.strategy';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Auth',
        schema: AuthSchema,
        options: {
          tableName: '-auth'
        }
      }
    ]),
    PassportModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, SiweStrategy],
  exports: []
})
export class AuthModule {}
