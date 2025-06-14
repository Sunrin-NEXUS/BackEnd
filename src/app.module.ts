import {MailerModule} from '@nestjs-modules/mailer'
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ArticleModule} from './article/article.module'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: {
            host: config.get<string>('MAIL_HOST') ?? 'failed to load env', // 이메일을 보낼 SMTP 서버의 주소
            port: Number(config.get<string>('MAIL_PORT')), // SMTP 서버의 포트 번호
            secure: false,
            auth: {
              user: config.get<string>('MAIL_USER') ?? 'failed to load env', // SMTP 서버 인증을 위한 이메일
              pass: config.get<string>('MAIL_PASSWORD') ?? 'failed to load env' // SMTP 서버 인증을 위한 비밀번호
            }
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>'
          },
          template: {
            dir: __dirname + '/..' + '/views',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            }
          }
        })
    }),
    PrismaModule,
    AuthModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
