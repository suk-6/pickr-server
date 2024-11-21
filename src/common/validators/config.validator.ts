import * as Joi from 'joi';

export const ConfigValidator = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('production'),
  CORS_ORIGIN: Joi.string().default('*'),
  CORS_METHODS: Joi.string().default('GET,PUT,POST,DELETE,PATCH'),
  CORS_CREDENTIALS: Joi.boolean().default(true),
  CORS_PREFLIGHT: Joi.boolean().default(false),
  CORS_OPTIONS_STATUS: Joi.number().default(204),
  SWAGGER_ENABLED: Joi.boolean(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  ACHE_TTL: Joi.number().default(60 * 1000),
  CACHE_MAX: Joi.number().default(100),
});
