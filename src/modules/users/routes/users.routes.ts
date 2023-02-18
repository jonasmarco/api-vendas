import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import multer from 'multer'
import uploadConfig from '@config/upload'
import UsersController from '../controllers/UsersController'
import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRoute = Router()
const usersController = new UsersController()
const usersAvatarController = new UserAvatarController()

const upload = multer(uploadConfig)

usersRoute.get('/', isAuthenticated, usersController.index)

usersRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  usersController.create
)

usersRoute.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  usersController.delete
)

usersRoute.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update
)

export default usersRoute
