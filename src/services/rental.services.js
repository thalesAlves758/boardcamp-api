import dayjs from 'dayjs';

import connection from '../config/database/pg.js';

async function getRentals({
  customerId = null,
  gameId = null,
  offset,
  limit,
  order,
  desc,
}) {
  const OFFSET_DEFAULT = 0;
  const LIMIT_DEFAULT = 1000;

  const { rows } = await connection.query(
    `
    SELECT r.*, r."rentDate"::VARCHAR, row_to_json(g) as game, row_to_json(c) as customer FROM rentals r
    JOIN (
      SELECT games.id, games.name, games."categoryId", categories.name as "categoryName"
      FROM games
      JOIN categories ON games."categoryId" = categories.id
    ) g ON r."gameId" = g.id
    JOIN (
      SELECT id, name FROM customers
    ) c ON r."customerId" = c.id
    ORDER BY ${order || 'id'} ${desc ? 'DESC' : 'ASC'}
    OFFSET $1
    LIMIT $2
  `,
    [offset || OFFSET_DEFAULT, limit || LIMIT_DEFAULT]
  );

  const rentals =
    customerId || gameId
      ? rows.filter((rental) => {
          if (customerId && rental.customerId !== parseInt(customerId)) {
            return false;
          }

          if (gameId && rental.gameId !== parseInt(gameId)) {
            return false;
          }

          return true;
        })
      : rows;

  return rentals;
}

async function createRental({
  customerId,
  gameId,
  daysRented,
  gamePricePerDay,
}) {
  const rentDate = dayjs().format('YYYY-MM-DD');
  const originalPrice = gamePricePerDay * daysRented;
  const returnDate = null;
  const delayFee = null;

  await connection.query(
    `
    INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
    [
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    ]
  );
}

async function getRentalsByGameId(gameId) {
  const { rows: games } = await connection.query(
    `
    SELECT * FROM rentals WHERE "gameId" = $1
  `,
    [gameId]
  );

  return games;
}

async function deleteRentalById(id) {
  await connection.query(
    `
    DELETE FROM rentals WHERE id = $1
  `,
    [id]
  );
}

async function getRentalById(id) {
  const {
    rows: [rental],
  } = await connection.query(
    `
    SELECT * FROM rentals WHERE id = $1
  `,
    [id]
  );

  return rental;
}

async function returnRentalById(id, { returnDate, delayFee }) {
  await connection.query(
    `
    UPDATE rentals
    SET "returnDate" = $1, "delayFee" = $2
    WHERE id = $3
  `,
    [returnDate, delayFee, id]
  );
}

export {
  getRentals,
  createRental,
  getRentalsByGameId,
  deleteRentalById,
  getRentalById,
  returnRentalById,
};
