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
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8000',
      'http://20.214.34.32:3000',
      'http://nexus.zegiha.work:3000',
      'https://20.214.34.32:3000',
      'https://nexus.zegiha.work:3000',
      process.env.CORE_API_URL ?? 'http://localhst:3000',
      process.env.CRAWL_API_URL ?? 'http://localhost:8000',
    ],
    credentials: true,
  })

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
