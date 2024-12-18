import { ResourceMetadataScanner } from '@camp/auth-client';
import { INestApplication } from '@nestjs/common';

/** Autofill resources list from Resource decorator on each endpoint */
export const scanResources = (app: INestApplication): void => {
  new ResourceMetadataScanner(app).scan();
};
