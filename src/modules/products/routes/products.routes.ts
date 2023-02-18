import { Router } from 'express'
import ProductsController from '../controllers/ProductsController'
import { celebrate, Joi, Segments } from 'celebrate'

const productRoute = Router()
const productsController = new ProductsController()

productRoute.get('/', productsController.index)

productRoute.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  productsController.show
)

productRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required()
    }
  }),
  productsController.create
)

productRoute.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required()
    }
  }),
  productsController.update
)

productRoute.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  productsController.delete
)

export default productRoute
