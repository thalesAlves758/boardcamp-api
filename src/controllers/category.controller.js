import categorySchema from '../schemas/category.schema.js';
import {
  getAllCategories,
  createCategory,
  getCategoryByName,
} from '../services/category.services.js';
import httpStatus from '../utils/httpStatus.js';

async function index(req, res) {
  const { offset, limit } = req.query;

  try {
    const categories = await getAllCategories({ offset, limit });

    res.send(categories);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function create(req, res) {
  const { name } = req.body;

  const validation = categorySchema.validate({ name });

  if (validation.error) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }

  const categoryExists = await getCategoryByName(name);

  if (categoryExists) {
    res.sendStatus(httpStatus.CONFLICT);
    return;
  }

  try {
    await createCategory({ name });

    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { index, create };
