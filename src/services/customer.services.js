import connection from '../config/database/pg.js';

async function getAllCustomers({ cpf = '', offset, limit }) {
  const OFFSET_DEFAULT = 0;
  const LIMIT_DEFAULT = 1000;

  const { rows: customers } = await connection.query(
    `
    SELECT *, birthday::VARCHAR FROM customers
    WHERE cpf LIKE $1
    OFFSET $2
    LIMIT $3
  `,
    [`${cpf}%`, offset || OFFSET_DEFAULT, limit || LIMIT_DEFAULT]
  );

  return customers;
}

async function getCustomerById(id) {
  const {
    rows: [customer],
  } = await connection.query(
    `
    SELECT *, birthday::VARCHAR FROM customers
    WHERE id = $1
  `,
    [id]
  );

  return customer;
}

async function getCustomerByCpf(cpf) {
  const {
    rows: [customer],
  } = await connection.query(
    `
    SELECT *, birthday::VARCHAR FROM customers
    WHERE cpf = $1
  `,
    [cpf]
  );

  return customer;
}

async function createCustomer({ name, phone, cpf, birthday }) {
  await connection.query(
    `
    INSERT INTO customers (name, phone, cpf, birthday)
    VALUES ($1, $2, $3, $4)
  `,
    [name, phone, cpf, birthday]
  );
}

async function updateCustomer(id, { name, phone, cpf, birthday }) {
  await connection.query(
    `
    UPDATE customers
    SET name = $1, phone = $2, cpf = $3, birthday = $4
    WHERE id = $5
  `,
    [name, phone, cpf, birthday, id]
  );
}

export {
  getAllCustomers,
  getCustomerById,
  getCustomerByCpf,
  createCustomer,
  updateCustomer,
};
