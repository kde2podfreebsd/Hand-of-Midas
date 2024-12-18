import { DEFAULT_SERVICE_TAG } from '@common/constants';
import convict from 'convict';

const values = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'node-env',
  },
  globalPrefix: {
    doc: 'Global API prefix',
    default: `/api/${DEFAULT_SERVICE_TAG}`,
    env: 'API_PREFIX',
    format: String,
  },
  swaggerPrefix: {
    doc: 'Swagger prefix',
    default: `/swagger/${DEFAULT_SERVICE_TAG}`,
    env: 'SWAGGER_PREFIX',
    format: String,
  },
  healthcheckPrefix: {
    doc: 'Healthcheck prefix',
    default: '/healthcheck',
    env: 'HEALTHCHECK_PREFIX',
    format: String,
  },
  port: {
    default: 3000,
    env: 'APP_PORT',
    doc: 'Application port',
    format: Number,
  },
  corsOrigin: {
    doc: 'CORS origin',
    format: String,
    default: undefined,
    env: 'CORS_ORIGIN',
  },
  logLevel: {
    default: 'debug',
    env: 'LOG_LEVEL',
    doc: 'Log level',
    format: String,
  },
  databaseUrl: {
    default: `postgresql://admin:admin@localhost:5432/${DEFAULT_SERVICE_TAG}_test?schema=public`,
    env: 'DATABASE_URL',
    doc: 'Database url for prisma',
    format: String,
  },
  auth: {
    baseUrl: {
      default: 'http://localhost:5050/api/auth',
      env: 'AUTH_SERVICE_URL',
      doc: 'Auth service url',
      format: String,
    },
    patternPrefix: {
      default: DEFAULT_SERVICE_TAG,
      env: 'AUTH_RESOURCE_PATTERN_PREFIX',
      doc: 'Unique service name (conflict protection)',
      format: String,
    },
    apiClientConfig: {
      serviceTag: {
        default: DEFAULT_SERVICE_TAG,
        env: 'AUTH_RESOURCE_PATTERN_PREFIX',
        doc: 'Unique service name (for login as api)',
        format: String,
      },
      apiKey: {
        default: '',
        env: 'AUTH_API_KEY',
        doc: 'Authentication key for login as api',
        format: String,
      },
      resourceAutoSync: {
        default: true,
        env: 'AUTH_RESOURCE_AUTOSYNC',
        doc: 'Perform resource sync on startup',
        format: Boolean,
      },
    },
  },
});

values.validate({ allowed: 'strict' });

export const config = values.getProperties();
