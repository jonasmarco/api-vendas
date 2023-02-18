import { Router } from 'express'
import productRoute from '@modules/products/routes/products.routes'
import userRoute from '@modules/users/routes/users.routes'
import sessionRoute from '@modules/users/routes/sessions.routes'

const routes = Router()

routes.use('/products', productRoute)
routes.use('/users', userRoute)
routes.use('/sessions', sessionRoute)

export default routes
