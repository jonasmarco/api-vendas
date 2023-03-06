import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import ForgotPasswordController from '../controllers/ForgotPasswordController'

const passwordRoute = Router()
const forgotPasswordController = new ForgotPasswordController()

passwordRoute.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required()
    }
  }),
  forgotPasswordController.create
)

export default passwordRoute
