import { Router } from 'express';

import categoriesRouter from './routes/categories.routes.js';
import customerRouter from './routes/customers.routes.js';
import gamesRouter from './routes/games.routes.js';

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customerRouter);

export default router;
