import { Module } from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controler'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answer.controller'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-question.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    DeleteQuestionController,
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
