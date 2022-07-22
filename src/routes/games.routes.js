import { Router } from 'express';

import gameController from '../controllers/game.controller.js';

const gamesRouter = Router();

gamesRouter.get('/games', gameController.index);
gamesRouter.post('/games', gameController.create);

export default gamesRouter;
