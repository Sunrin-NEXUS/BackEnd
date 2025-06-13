import {ValidationPipe} from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import { AppModule } from './app.module';
import {HttpExceptionFilter} from './common/filter/httpException.filter'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
  app.useGlobalFilters(new HttpExceptionFilter())

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
