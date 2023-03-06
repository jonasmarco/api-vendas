import { Router } from 'express'
import productRoute from '@modules/products/routes/products.routes'
import userRoute from '@modules/users/routes/users.routes'
import sessionRoute from '@modules/users/routes/sessions.routes'
import passwordRoute from '@modules/users/routes/password.routes'

const routes = Router()

routes.use('/products', productRoute)
routes.use('/users', userRoute)
routes.use('/sessions', sessionRoute)
routes.use('/password', passwordRoute)

export default routes
