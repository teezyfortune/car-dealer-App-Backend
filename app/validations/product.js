import Joi from 'joi';
import { stringCheck, editStringCheck } from './generic';

const productSchema = Joi.object({
  type: stringCheck('Type', Joi, 3),
  name: stringCheck('Product name', Joi, 3),
  manufacturedDate: stringCheck('Manufactured date', Joi, 3),
  description: stringCheck('Description', Joi, 3)
});

const updateProductSchema = Joi.object({
  vehicle_type: editStringCheck('Type', Joi, 3),
  name: editStringCheck('Product name', Joi, 3),
  manufactured_date: editStringCheck('Manufactured date', Joi, 3),
  vehicle_history: editStringCheck('Description', Joi, 3)
});

export { productSchema, updateProductSchema };
