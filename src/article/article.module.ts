import {Module} from '@nestjs/common'
import {ArticleController} from './article.controller'
import {ArticleService} from './article.service'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
  imports: [NotificationModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}