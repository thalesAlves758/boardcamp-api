import gameSchema from '../schemas/game.schema.js';
import { getCategoryById } from '../services/category.services.js';
import {
  getAllGames,
  createGame,
  getGameByName,
} from '../services/game.services.js';
import httpStatus from '../utils/httpStatus.js';

async function index(req, res) {
  const { name, offset, limit, order, desc } = req.query;

  try {
    const games = await getAllGames({ name, offset, limit, order, desc });

    res.send(games);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function create(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validation = gameSchema.validate({
    name,
    image,
    stockTotal,
    pricePerDay,
  });

  try {
    const categoryExists = await getCategoryById(categoryId);

    if (!categoryExists || validation.error) {
      res.sendStatus(httpStatus.BAD_REQUEST);
      return;
    }

    const gameExists = await getGameByName(name);

    if (gameExists) {
      res.sendStatus(httpStatus.CONFLICT);
      return;
    }

    await createGame({ name, image, stockTotal, categoryId, pricePerDay });

    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { index, create };
