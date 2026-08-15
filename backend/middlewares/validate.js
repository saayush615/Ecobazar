import { createValidationError } from "../utils/ErrorFactory.js";

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    return next(createValidationError(message));
  }

  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    return next(createValidationError(message));
  }

  req.query = result.data;
  next();
};