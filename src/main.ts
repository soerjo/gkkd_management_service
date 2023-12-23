import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  app.use(compression());
  app.use(morgan('tiny'));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(':v/docs', app, document);

  await app.listen(configService.get('PORT'));
  console.log(`server run in port: ${configService.get('PORT')}`);
}
bootstrap();
