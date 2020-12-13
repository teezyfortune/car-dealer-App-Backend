const numberCheck = (param, joiObject, min = 1) => joiObject
  .number()
  .required()
  .min(min)
  .messages({
    'any.required': `${param} is a required field`,
    'number.base': `${param} must be a number`,
    'number.empty': `${param} cannot be an empty field`,
    'number.min': `${param} can not be lesser than ${min} characters`
  });

const stringCheck = (param, joiObject, min = 1, max = 120) => joiObject
  .string()
  .required()
  .min(min)
  .max(max)
  .messages({
    'any.required': `${param} is a required field`,
    'string.max': `${param} can not be lesser than ${max} characters`,
    'string.min': `${param} can not be lesser than ${min} characters`,
    'string.base': `${param} must be a string`,
    'string.empty': `${param} cannot be an empty field`
  });

const dateCheck = (param, joiObject) => joiObject
  .date()
  .required()
  .messages({
    'any.required': `${param} is a required field`,
    'date.base': `${param} must be a correct date`,
    'string.empty': `${param} cannot be an empty field`
  });

const password = (joiObject) => joiObject.string().trim().required().min(7)
  .messages({
    'string.base': 'Password must be a va string',
    'string.empty': 'Password field cannot be an empty field',
    'any.required':
      'Password field is required else password cannot be updated',
    'string.min': 'Password can not be lesser than 7 characters'
  });

const editStringCheck = (param, joiObject, min = 0, max = 120) => joiObject
  .string()
  .min(min)
  .max(max)
  .messages({
    'string.base': `${param}  must be a string`,
    'string.empty': `${param} cannot be an empty field`,
    'string.max': `${param} can not be lesser than ${max} characters`,
    'string.min': `${param} can not be lesser than ${min} characters`
  });

const editNumberCheck = (param, joiObject) => joiObject.number().messages({
  'number.base': `${param}  must be a number`,
  'string.empty': `${param} cannot be an empty field`
});


const list = (fields, param, joiObject) => joiObject
  .string()
  .required()
  .valid(...fields)
  .messages({
    'string.empty': `${param} must not be an empty field`,
    'any.required': `${param} is a required field`,
    'string.valid.base': `Please enter a valid ${param}`
  });

const arrayString = (param, joiObject) => joiObject
  .array()
  .items(joiObject.string())
  .required()
  .messages({
    'array.empty': `${param} is a required field`,
    'array.base': `${param} must be a valid array`,
    'any.required': `${param} cannot be an empty field`
  });

const editDateCheck = (param, joiObject) => joiObject.date().messages({
  'any.required': `${param} is a required field`,
  'date.base': `${param} must be a correct date`,
  'string.empty': `${param} cannot be an empty field`
});

const emailCheck = (joiObject) => joiObject.string().email().required().messages({
  'any.required': 'Email is a required field',
  'string.email': 'Email is not valid',
  'string.empty': 'Email cannot be an empty field'
});

export {
  numberCheck,
  stringCheck,
  dateCheck,
  password,
  editStringCheck,
  editNumberCheck,
  list,
  editDateCheck,
  arrayString,
  emailCheck
};
