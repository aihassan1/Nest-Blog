import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * swagger config
   */
  const config = new DocumentBuilder()
    .setTitle('NestJs Masterclass - Blog App API')
    .setDescription('Use the base API url as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build();

  // instantiate document
  const document = SwaggerModule.createDocument(app, config);

  // setup your documentation
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
