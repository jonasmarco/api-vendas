import { Router } from 'express'

import OrdersController from '../controllers/OrdersController'
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'

const ordersRouter = Router()
const ordersController = new OrdersController()

ordersRouter.use(isAuthenticated)

ordersRouter.get('/', ordersController.index)

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  ordersController.show
)

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required()
    }
  }),
  ordersController.create
)

export default ordersRouter
