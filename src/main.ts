import {ValidationPipe} from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('Nexus Core Backend')
    .setDescription('The news viewer service, Nexus API Description')
    .setVersion('0.1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, documentConfig)
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
