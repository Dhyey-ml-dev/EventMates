import { z } from 'zod';

export const handleValidationError = (error) => {
  if (error instanceof z.ZodError) {
    return {
      success: false,
      message: 'Validation error',
      errors: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }
  return {
    success: false,
    message: 'Invalid input',
  };
};

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      return res.status(400).json(handleValidationError(error));
    }
  };
};

export default {
  handleValidationError,
  validateRequest,
};
