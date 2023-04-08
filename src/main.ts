import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function startApp() {
  const PORT = process.env.APP_PORT || 5555;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Стол')
    .setDescription('Документация REST API')
    .addBearerAuth({ in: 'header', type: 'http' })
    .setVersion('1.0.0')
    .addTag('Стол  ')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
}

startApp();
