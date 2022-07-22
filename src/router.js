import { Router } from 'express';

import categoriesRouter from './routes/categories.routes.js';
import gamesRouter from './routes/games.routes.js';

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);

export default router;
