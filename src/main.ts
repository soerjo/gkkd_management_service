import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AdvancedFilterPlugin } from './utils/swagger-plugin.util';
import { initializeTransactionalContext } from 'typeorm-transactional';
// import * as morgan from 'morgan';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ credentials: true });
  // app.use(morgan('tiny'));

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
