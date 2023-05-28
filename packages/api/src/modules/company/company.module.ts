import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanySchema } from './company.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Company',
        schema: CompanySchema,
        options: {
          tableName: '-company'
        }
      }
    ])
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule {}
