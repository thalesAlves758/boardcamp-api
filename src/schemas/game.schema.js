import Joi from 'joi';

const GREATER_THAN = 0;

const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().greater(GREATER_THAN).required(),
  pricePerDay: Joi.number().greater(GREATER_THAN).required(),
});

export default gameSchema;
