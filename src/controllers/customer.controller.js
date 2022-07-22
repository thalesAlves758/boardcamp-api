import customerSchema from '../schemas/customer.schema.js';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerByCpf,
  createCustomer,
  updateCustomer,
} from '../services/customer.services.js';
import httpStatus from '../utils/httpStatus.js';

async function index(req, res) {
  const { cpf } = req.query;

  try {
    const customers = await getAllCustomers({ cpf });

    res.send(customers);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function show(req, res) {
  const { id } = req.params;

  try {
    const customer = await getCustomerById(id);

    if (!customer) {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }

    res.send(customer);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function create(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  const validation = customerSchema.validate({ name, phone, cpf, birthday });

  if (validation.error) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }

  try {
    const customerExists = await getCustomerByCpf(cpf);

    if (customerExists) {
      res.sendStatus(httpStatus.CONFLICT);
      return;
    }

    await createCustomer({ name, phone, cpf, birthday });

    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const validation = customerSchema.validate({ name, phone, cpf, birthday });

  if (validation.error) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }

  try {
    const customerExists = await getCustomerByCpf(cpf);

    if (customerExists) {
      res.sendStatus(httpStatus.CONFLICT);
      return;
    }

    await updateCustomer(id, { name, phone, cpf, birthday });

    res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { index, show, create, update };
