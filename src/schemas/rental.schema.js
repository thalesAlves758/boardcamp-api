import Joi from 'joi';

const GREATER_THAN = 0;

const rentalSchema = Joi.object({
  customerId: Joi.number().required(),
  gameId: Joi.number().required(),
  daysRented: Joi.number().greater(GREATER_THAN).required(),
});

export default rentalSchema;
