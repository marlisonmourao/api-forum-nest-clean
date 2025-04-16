import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-question.controller'

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
  ],
  providers: [],
})
export class HttpModule {}
