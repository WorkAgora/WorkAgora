import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.schema';
import { AuthService } from './auth.service';

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
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: []
})
export class AuthModule {}
