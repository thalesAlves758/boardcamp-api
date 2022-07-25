import connection from '../config/database/pg.js';

async function getAllCategories({ offset, limit, order, desc }) {
  const OFFSET_DEFAULT = 0;
  const LIMIT_DEFAULT = 1000;

  const { rows: categories } = await connection.query(
    `
    SELECT * FROM categories
    ORDER BY ${order || 'id'} ${desc ? 'DESC' : 'ASC'}
    OFFSET $1
    LIMIT $2
  `,
    [offset || OFFSET_DEFAULT, limit || LIMIT_DEFAULT]
  );

  return categories;
}

async function getCategoryByName(name) {
  const {
    rows: [category],
  } = await connection.query(
    `
    SELECT * FROM categories WHERE name = $1
  `,
    [name]
  );

  return category;
}

async function getCategoryById(id) {
  const {
    rows: [category],
  } = await connection.query(
    `
    SELECT * FROM categories WHERE id = $1
  `,
    [id]
  );

  return category;
}

async function createCategory({ name }) {
  await connection.query(
    `
    INSERT INTO categories (name) VALUES ($1)
  `,
    [name]
  );
}

export { getAllCategories, getCategoryByName, getCategoryById, createCategory };
