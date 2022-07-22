import { Router } from 'express';

import categoryController from '../controllers/category.controller.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', categoryController.index);
categoriesRouter.post('/categories', categoryController.create);

export default categoriesRouter;
