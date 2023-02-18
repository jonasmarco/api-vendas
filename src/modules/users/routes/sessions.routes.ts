import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import SessionsController from '../controllers/SessionsController'

const sessionRoute = Router()
const sessionsController = new SessionsController()

sessionRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  sessionsController.create
)

export default sessionRoute
