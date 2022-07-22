import { Router } from 'express';
import customerController from '../controllers/customer.controller.js';

const customersRouter = Router();

customersRouter.get('/customers', customerController.index);
customersRouter.get('/customers/:id', customerController.show);
customersRouter.post('/customers', customerController.create);
customersRouter.put('/customers/:id', customerController.update);

export default customersRouter;
