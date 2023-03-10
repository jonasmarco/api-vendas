import { Router } from 'express'
import productRouter from '@modules/products/routes/products.routes'
import userRouter from '@modules/users/routes/users.routes'
import sessionRouter from '@modules/users/routes/sessions.routes'
import passwordRouter from '@modules/users/routes/password.routes'

const routes = Router()

routes.use('/products', productRouter)
routes.use('/users', userRouter)
routes.use('/sessions', sessionRouter)
routes.use('/password', passwordRouter)

export default routes
