import { Request , Response } from 'express'
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NpsController {
    async execute(request: Request, response: Response){
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveysUsers.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;
        const promoter = surveysUsers.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;
        const total = surveysUsers.length;

        const nps = (promoter - detractor) / total * 100.0;

        return response.json({
            detractor,
            promoter,
            total,
            nps
        })
    }
}

export { NpsController }