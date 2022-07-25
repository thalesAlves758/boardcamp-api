import connection from '../config/database/pg.js';

async function getAllGames({ name = '', offset, limit }) {
  const OFFSET_DEFAULT = 0;
  const LIMIT_DEFAULT = 1000;

  const { rows: games } = await connection.query(
    `
    SELECT g.*, c.name as "categoryName" FROM games g
    JOIN categories c
    ON g."categoryId" = c.id
    WHERE g.name ILIKE $1
    OFFSET $2
    LIMIT $3
  `,
    [`${name}%`, offset || OFFSET_DEFAULT, limit || LIMIT_DEFAULT]
  );

  return games;
}

async function createGame({
  name,
  image,
  stockTotal,
  categoryId,
  pricePerDay,
}) {
  await connection.query(
    `
    INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
    VALUES ($1, $2, $3, $4, $5)
  `,
    [name, image, stockTotal, categoryId, pricePerDay]
  );
}

async function getGameByName(name) {
  const {
    rows: [game],
  } = await connection.query(
    `
    SELECT g.*, c.name as "categoryName" FROM games g
    JOIN categories c
    ON g."categoryId" = c.id
    WHERE g.name = $1
  `,
    [name]
  );

  return game;
}

async function getGameById(id) {
  const {
    rows: [game],
  } = await connection.query(
    `
    SELECT * FROM games WHERE id = $1
  `,
    [id]
  );

  return game;
}

export { getAllGames, getGameByName, createGame, getGameById };
