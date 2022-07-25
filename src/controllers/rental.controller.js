import dayjs from 'dayjs';
import rentalSchema from '../schemas/rental.schema.js';
import { getCustomerById } from '../services/customer.services.js';
import { getGameById } from '../services/game.services.js';
import {
  createRental,
  deleteRentalById,
  getRentalById,
  getRentals,
  getRentalsByGameId,
  returnRentalById,
} from '../services/rental.services.js';
import httpStatus from '../utils/httpStatus.js';

async function index(req, res) {
  const { customerId, gameId, offset, limit } = req.query;

  const rentals = await getRentals({ customerId, gameId, offset, limit });

  res.send(rentals);
}

async function create(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const validation = rentalSchema.validate({ customerId, gameId, daysRented });

  if (validation.error) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }

  try {
    const game = await getGameById(gameId);
    const customer = await getCustomerById(customerId);
    const rentedGames = await getRentalsByGameId(gameId);

    if (!game || !customer || rentedGames.length >= game.stockTotal) {
      res.sendStatus(httpStatus.BAD_REQUEST);
      return;
    }

    await createRental({
      customerId,
      gameId,
      daysRented,
      gamePricePerDay: game.pricePerDay,
    });

    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

function calculateDelayFee(rentDate, daysRented, returnDate, gamePricePerDay) {
  const expectedReturnDate = dayjs(rentDate).add(daysRented, 'day');

  const isAfter = dayjs(returnDate).isAfter(expectedReturnDate);

  const NO_DELAY = 0;

  if (isAfter) {
    const days = dayjs(returnDate).diff(expectedReturnDate, 'day');

    return days * gamePricePerDay;
  }

  return NO_DELAY;
}

async function returnRental(req, res) {
  const id = parseInt(req.params.id);

  try {
    const rental = await getRentalById(id);

    if (!rental) {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }

    if (rental.returnDate) {
      res.sendStatus(httpStatus.BAD_REQUEST);
      return;
    }

    const game = await getGameById(rental.gameId);
    const returnDate = dayjs().format('YYYY-MM-DD');

    const delayFee = calculateDelayFee(
      rental.rentDate,
      rental.daysRented,
      returnDate,
      game.pricePerDay
    );

    await returnRentalById(id, { returnDate, delayFee });

    res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req, res) {
  const id = parseInt(req.params.id);

  try {
    const rental = await getRentalById(id);

    if (!rental) {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }

    if (!rental.returnDate) {
      res.sendStatus(httpStatus.BAD_REQUEST);
      return;
    }

    await deleteRentalById(id);

    res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { index, create, remove, returnRental };
