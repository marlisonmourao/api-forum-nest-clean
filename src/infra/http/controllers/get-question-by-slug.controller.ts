import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handler(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    const question = result.value.question

    return {
      question: QuestionPresenter.toHTTP(question),
    }
  }
}
