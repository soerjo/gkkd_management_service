import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { AdvancedFilterPlugin } from './utils/swagger-plugin.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  app.enableCors({
    // origin: [configService.get('APP_URL'), configService.get('WEB_URL')],
    credentials: true,
  });
  app.use(compression());
  app.use(morgan('tiny'));

  const theme = new SwaggerTheme();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(':v/docs', app, document, {
    swaggerOptions: {
      filter: true, // Enable the search bar
      showRequestDuration: true, // Show the duration of each request
      plugins: [AdvancedFilterPlugin],
    },
    customCss: theme.getBuffer('flattop' as SwaggerThemeName),
    customSiteTitle: 'Boilerplate Documentation',
  });

  await app.listen(configService.get('PORT'));
  console.log(`server run in port: ${configService.get('PORT')}`);
}
bootstrap();
