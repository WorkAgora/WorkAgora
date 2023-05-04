import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SiweStrategy } from './siwe.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY
      })
    }),
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
  providers: [AuthService, SiweStrategy, JwtStrategy],
  exports: []
})
export class AuthModule {}
