import connection from '../config/database/pg.js';

async function getAllCategories() {
  const { rows: categories } = await connection.query(`
    SELECT * FROM categories
  `);

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

async function createCategory({ name }) {
  await connection.query(
    `
    INSERT INTO categories (name) VALUES ($1)
  `,
    [name]
  );
}

export { getAllCategories, getCategoryByName, createCategory };
