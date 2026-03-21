const bodySchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number', required: true }
};

const querySchema = {
  limit: { type: 'number', required: true },
  includeInactive: { type: 'boolean', required: false, default: false }
};

function coerceValue(value, type) {
  switch (type) {
    case 'string':
      if (typeof value === 'string') {
        return value.trim();
      }
      if (value === null || value === undefined) {
        return undefined;
      }
      return String(value);
    case 'number':
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
      }
      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    case 'boolean':
      if (typeof value === 'boolean') {
        return value;
      }
      if (typeof value === 'string') {
        const lowered = value.toLowerCase();
        if (lowered === 'true') {
          return true;
        }
        if (lowered === 'false') {
          return false;
        }
      }
      if (value === 1) {
        return true;
      }
      if (value === 0) {
        return false;
      }
      return undefined;
    default:
      return undefined;
  }
}

function validateSection(payload, schema, location, errors) {
  const sanitized = {};
  Object.keys(schema).forEach((field) => {
    const rules = schema[field];
    const rawValue = Object.prototype.hasOwnProperty.call(payload, field) ? payload[field] : undefined;

    if (rawValue === undefined || rawValue === null || rawValue === '') {
      if (rules.required) {
        errors.push(`${location}.${field} is required`);
      } else if (Object.prototype.hasOwnProperty.call(rules, 'default')) {
        sanitized[field] = rules.default;
      }
      return;
    }

    const coerced = coerceValue(rawValue, rules.type);
    if (coerced === undefined) {
      errors.push(`${location}.${field} must be a valid ${rules.type}`);
      return;
    }

    sanitized[field] = coerced;
  });

  return sanitized;
}

module.exports = function (req, res, next) {
  try {
    const errors = [];

    const bodyPayload = req && typeof req.body === 'object' ? req.body : {};
    const queryPayload = req && typeof req.query === 'object' ? req.query : {};

    const sanitizedBody = validateSection(bodyPayload, bodySchema, 'body', errors);
    const sanitizedQuery = validateSection(queryPayload, querySchema, 'query', errors);

    if (errors.length > 0) {
      const validationError = new Error('Invalid request parameters');
      validationError.status = 400;
      validationError.details = errors;
      return next(validationError);
    }

    req.validated = {
      body: sanitizedBody,
      query: sanitizedQuery
    };

    return next();
  } catch (err) {
    return next(err);
  }
};