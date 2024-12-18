import { SERVICE_NAME } from '@common/constants';
import { config } from '@infrastructure/config';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller(config.healthcheckPrefix)
export class HealthCheckController {
  @Get()
  public getRoot(): string {
    return `${SERVICE_NAME} is ok. May the Force be with you.`;
  }
}
