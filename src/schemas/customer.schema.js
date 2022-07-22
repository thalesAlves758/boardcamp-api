import JoiImport from 'joi';
import DateExtension from '@joi/date';

const Joi = JoiImport.extend(DateExtension);

const customerSchema = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.string()
    .pattern(/[0-9]{11}/)
    .required(),
  phone: Joi.string()
    .pattern(/[0-9]{10,11}/)
    .required(),
  birthday: Joi.date().format('YYYY-MM-DD').required(),
});

export default customerSchema;
