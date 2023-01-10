import Joi from 'joi';

const create = Joi.object({
  text: Joi.string().required().min(3),
  number: Joi.number().greater(0).required(),
});

const findFiltered = Joi.object({
  min: Joi.number().greater(0),
  max: Joi.number(),
  text: Joi.string().min(3),
});

export default {
  create,
  findFiltered,
};
