import { Handler, Context, Callback } from 'aws-lambda';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import serverlessExpress from '@vendia/serverless-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let server: Handler;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('WorkAgora API')
    .setDescription('WorkAgora API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrapServer(): Promise<Handler> {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.use(eventContext());
  nestApp.use(cookieParser());
  nestApp.enableCors({
    origin: `${process.env.FRONT_PROTOCOL}${process.env.FRONT_URL}`,
    credentials: true
  });
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false
    })
  );
  setupSwagger(nestApp);
  await nestApp.init();

  const expressApp = nestApp.getHttpAdapter().getInstance();
  Logger.log(`🚀 API app is running on port ${process.env.PORT || 3000}`);
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (event.path === '/swagger') {
    event.path = '/swagger/';
  }
  event.path = event.path.includes('swagger-ui') ? `/swagger${event.path}` : event.path;

  server = server ?? (await bootstrapServer());
  return server(event, context, callback);
};
function eventContext(): any {
  throw new Error('Function not implemented.');
}

